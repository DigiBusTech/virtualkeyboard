import {
  PermissionsAndroid,
  Permission,
  PermissionStatus,
  Platform,
} from 'react-native';

/**
 * Crucial Architecture Note:
 * iOS strictly prohibits broadcasting standard Bluetooth HID services (UUID 0x1812)
 * via public CoreBluetooth APIs. To build a serverless Bluetooth keyboard/mouse,
 * the host device must run Android with BluetoothHidDevice API (Android 9+ / API 28+).
 */
export const MIN_ANDROID_HID_API_LEVEL = 28;

export interface DeviceSupportStatus {
  isSupported: boolean;
  platform: string;
  apiVersion: number;
  reason?: string;
}

export interface PermissionDetails {
  permission: Permission;
  label: string;
  description: string;
  minApiLevel: number;
}

export interface PermissionCheckResult {
  allGranted: boolean;
  isSupported: boolean;
  statuses: Record<string, boolean>;
  missing: Permission[];
}

export interface PermissionRequestResult {
  allGranted: boolean;
  isSupported: boolean;
  statuses: Record<string, PermissionStatus>;
  missing: Permission[];
  message?: string;
}

/**
 * Detailed metadata for Bluetooth and Location permissions required by Bluetooth HID.
 */
export const PERMISSION_METADATA: Record<string, PermissionDetails> = {
  [PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]: {
    permission: PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    label: 'Bluetooth Connect',
    description:
      'Required to connect to host devices (PC/Mac) and initiate Bluetooth HID profiles.',
    minApiLevel: 31,
  },
  [PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE]: {
    permission: PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
    label: 'Bluetooth Advertise',
    description:
      'Required to broadcast HID Mouse and Keyboard services (UUID 0x1812) to nearby hosts.',
    minApiLevel: 31,
  },
  [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN]: {
    permission: PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    label: 'Bluetooth Scan',
    description:
      'Required to discover and pair with nearby host computers without software installation.',
    minApiLevel: 31,
  },
  [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]: {
    permission: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    label: 'Fine Location',
    description:
      'Required on Android 9-11 (API 28-30) by the Android OS to perform Bluetooth device discovery.',
    minApiLevel: 28,
  },
};

/**
 * Returns the parsed Android API version as a number, or 0 if non-Android / unavailable.
 */
export function getAndroidApiVersion(): number {
  if (Platform.OS !== 'android') {
    return 0;
  }
  if (typeof Platform.Version === 'number') {
    return Platform.Version;
  }
  const parsed = parseInt(String(Platform.Version), 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Validates whether the current environment satisfies the minimum OS requirement
 * for Bluetooth HID Device API (Android 9.0+ / API 28+).
 */
export function isBluetoothHidSupported(): DeviceSupportStatus {
  if (Platform.OS !== 'android') {
    return {
      isSupported: false,
      platform: Platform.OS,
      apiVersion: 0,
      reason:
        'Apple strictly prohibits iOS apps from broadcasting standard Bluetooth HID services (UUID 0x1812) via public CoreBluetooth APIs. This app requires Android with BluetoothHidDevice API (API 28+).',
    };
  }

  const apiVersion = getAndroidApiVersion();

  if (apiVersion < MIN_ANDROID_HID_API_LEVEL) {
    return {
      isSupported: false,
      platform: 'android',
      apiVersion,
      reason: `Android API level ${apiVersion} detected. BluetoothHidDevice API requires Android 9.0 (API 28) or higher.`,
    };
  }

  return {
    isSupported: true,
    platform: 'android',
    apiVersion,
  };
}

/**
 * Returns the list of runtime permissions that need to be requested
 * based on the device's Android API level.
 */
export function getRequiredBluetoothPermissions(): Permission[] {
  if (Platform.OS !== 'android') {
    return [];
  }

  const apiVersion = getAndroidApiVersion();

  // Android 12+ (API 31+) uses fine-grained Bluetooth runtime permissions
  if (apiVersion >= 31) {
    return [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    ];
  }

  // Android 9 - 11 (API 28 - 30) requires fine location permission for Bluetooth discovery.
  // Note: BLUETOOTH and BLUETOOTH_ADMIN are normal permissions granted at install time via manifest.
  if (apiVersion >= MIN_ANDROID_HID_API_LEVEL) {
    return [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
  }

  return [];
}


/**
 * Checks the current grant status of all required Bluetooth permissions without prompting the user.
 */
export async function checkBluetoothPermissions(): Promise<PermissionCheckResult> {
  const support = isBluetoothHidSupported();
  if (!support.isSupported) {
    return {
      allGranted: false,
      isSupported: false,
      statuses: {},
      missing: [],
    };
  }

  const required = getRequiredBluetoothPermissions();
  const statuses: Record<string, boolean> = {};
  const missing: Permission[] = [];

  for (const permission of required) {
    try {
      const granted = await PermissionsAndroid.check(permission);
      statuses[permission] = granted;
      if (!granted) {
        missing.push(permission);
      }
    } catch {
      statuses[permission] = false;
      missing.push(permission);
    }
  }

  return {
    allGranted: missing.length === 0,
    isSupported: true,
    statuses,
    missing,
  };
}

/**
 * Requests all required Bluetooth permissions on app startup.
 * Prompts user for all required runtime permissions simultaneously.
 */
export async function requestBluetoothPermissions(): Promise<PermissionRequestResult> {
  const support = isBluetoothHidSupported();
  if (!support.isSupported) {
    return {
      allGranted: false,
      isSupported: false,
      statuses: {},
      missing: [],
      message: support.reason,
    };
  }

  const required = getRequiredBluetoothPermissions();
  if (required.length === 0) {
    return {
      allGranted: true,
      isSupported: true,
      statuses: {},
      missing: [],
      message: 'No runtime permissions required.',
    };
  }

  try {
    const rawResults = await PermissionsAndroid.requestMultiple(required);
    const statuses: Record<string, PermissionStatus> = {};
    const missing: Permission[] = [];

    for (const permission of required) {
      const status = rawResults[permission] ?? 'denied';
      statuses[permission] = status;
      if (status !== PermissionsAndroid.RESULTS.GRANTED) {
        missing.push(permission);
      }
    }

    const allGranted = missing.length === 0;

    return {
      allGranted,
      isSupported: true,
      statuses,
      missing,
      message: allGranted
        ? 'All Bluetooth permissions granted successfully.'
        : 'Some required Bluetooth permissions were not granted.',
    };
  } catch (error) {
    return {
      allGranted: false,
      isSupported: true,
      statuses: {},
      missing: required,
      message: error instanceof Error ? error.message : 'Permission request failed.',
    };
  }
}

/**
 * Helper to get a human-readable title for a permission.
 */
export function getPermissionLabel(permission: string): string {
  return PERMISSION_METADATA[permission]?.label ?? permission;
}

/**
 * Helper to get an explanation for why a permission is needed for HID mouse & keyboard.
 */
export function getPermissionDescription(permission: string): string {
  return (
    PERMISSION_METADATA[permission]?.description ??
    'Required for Bluetooth HID functionality.'
  );
}
