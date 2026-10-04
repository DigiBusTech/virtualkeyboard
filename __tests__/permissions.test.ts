import { PermissionsAndroid, Platform } from 'react-native';
import {
  isBluetoothHidSupported,
  getRequiredBluetoothPermissions,
  checkBluetoothPermissions,
  requestBluetoothPermissions,
  getPermissionLabel,
  getPermissionDescription,
  MIN_ANDROID_HID_API_LEVEL,
} from '../src/utils/permissions';

function mockPlatform(os: 'android' | 'ios', version: number | string) {
  Object.defineProperty(Platform, 'OS', {
    value: os,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(Platform, 'Version', {
    value: version,
    configurable: true,
    writable: true,
  });
}

describe('Bluetooth Permissions Utility', () => {
  const originalPlatform = Platform.OS;
  const originalVersion = Platform.Version;

  beforeEach(() => {
    mockPlatform('android', 33);
  });

  afterEach(() => {
    mockPlatform(originalPlatform as 'android' | 'ios', originalVersion);
    jest.restoreAllMocks();
  });

  describe('isBluetoothHidSupported', () => {
    it('rejects iOS due to Apple CoreBluetooth UUID 0x1812 restrictions', () => {
      mockPlatform('ios', '17.0');

      const status = isBluetoothHidSupported();
      expect(status.isSupported).toBe(false);
      expect(status.reason).toContain('Apple strictly prohibits iOS apps');
    });

    it('rejects Android below API 28', () => {
      mockPlatform('android', 26);

      const status = isBluetoothHidSupported();
      expect(status.isSupported).toBe(false);
      expect(status.apiVersion).toBe(26);
      expect(status.reason).toContain('API 28');
    });

    it('accepts Android at API 28 (Pie)', () => {
      mockPlatform('android', 28);

      const status = isBluetoothHidSupported();
      expect(status.isSupported).toBe(true);
      expect(status.apiVersion).toBe(MIN_ANDROID_HID_API_LEVEL);
    });

    it('accepts Android at API 34 (Android 14)', () => {
      mockPlatform('android', 34);

      const status = isBluetoothHidSupported();
      expect(status.isSupported).toBe(true);
      expect(status.apiVersion).toBe(34);
    });
  });

  describe('getRequiredBluetoothPermissions', () => {
    it('returns empty array on iOS', () => {
      mockPlatform('ios', '17.0');
      expect(getRequiredBluetoothPermissions()).toEqual([]);
    });

    it('returns ACCESS_FINE_LOCATION on Android 9-11 (API 28-30)', () => {
      mockPlatform('android', 29);

      const perms = getRequiredBluetoothPermissions();
      expect(perms).toEqual([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    });

    it('returns BLUETOOTH_CONNECT, ADVERTISE, and SCAN on Android 12+ (API 31+)', () => {
      mockPlatform('android', 34);

      const perms = getRequiredBluetoothPermissions();
      expect(perms).toEqual([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      ]);
    });
  });

  describe('checkBluetoothPermissions', () => {
    it('reports allGranted = true when all permissions are granted', async () => {
      mockPlatform('android', 33);

      jest.spyOn(PermissionsAndroid, 'check').mockResolvedValue(true);

      const result = await checkBluetoothPermissions();
      expect(result.allGranted).toBe(true);
      expect(result.missing).toHaveLength(0);
      expect(result.isSupported).toBe(true);
    });

    it('reports missing permissions when some are denied', async () => {
      mockPlatform('android', 33);

      jest
        .spyOn(PermissionsAndroid, 'check')
        .mockImplementation(async (permission) => {
          return (
            permission === PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
          );
        });

      const result = await checkBluetoothPermissions();
      expect(result.allGranted).toBe(false);
      expect(result.missing).toContain(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      );
      expect(result.missing).toContain(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      );
    });
  });

  describe('requestBluetoothPermissions', () => {
    it('requests multiple permissions on Android 12+ and evaluates grant results', async () => {
      mockPlatform('android', 33);

      jest.spyOn(PermissionsAndroid, 'requestMultiple').mockResolvedValue({
        [PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]:
          PermissionsAndroid.RESULTS.GRANTED,
        [PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE]:
          PermissionsAndroid.RESULTS.GRANTED,
        [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN]:
          PermissionsAndroid.RESULTS.GRANTED,
      } as any);

      const result = await requestBluetoothPermissions();
      expect(result.allGranted).toBe(true);
      expect(result.missing).toHaveLength(0);
      expect(
        result.statuses[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT],
      ).toBe('granted');
    });

    it('identifies ungranted permissions correctly when user denies one', async () => {
      mockPlatform('android', 33);

      jest.spyOn(PermissionsAndroid, 'requestMultiple').mockResolvedValue({
        [PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]:
          PermissionsAndroid.RESULTS.GRANTED,
        [PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE]:
          PermissionsAndroid.RESULTS.DENIED,
        [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN]:
          PermissionsAndroid.RESULTS.GRANTED,
      } as any);

      const result = await requestBluetoothPermissions();
      expect(result.allGranted).toBe(false);
      expect(result.missing).toEqual([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      ]);
    });
  });

  describe('Metadata helpers', () => {
    it('returns human-readable labels and descriptions', () => {
      expect(
        getPermissionLabel(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT),
      ).toBe('Bluetooth Connect');
      expect(
        getPermissionDescription(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ),
      ).toContain('connect to host devices');
    });
  });
});
