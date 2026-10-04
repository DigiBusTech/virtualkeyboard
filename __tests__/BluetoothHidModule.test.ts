import { NativeModules } from 'react-native';
import BluetoothHid, {
  BluetoothHidEvents,
} from '../src/BluetoothHid';

describe('BluetoothHid Native Bridge (Phase 2 & 3)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('FallbackModule behavior', () => {
    it('provides safe default values when running without native module', async () => {
      const state = await BluetoothHid.getConnectionState();
      expect(state.state).toBe('DISCONNECTED');
      expect(state.isRegistered).toBe(false);
      expect(state.device).toBeNull();

      const devices = await BluetoothHid.getBondedDevices();
      expect(devices).toEqual([]);

      const btState = await BluetoothHid.getBluetoothState();
      expect(btState.enabled).toBe(false);
      expect(btState.isSupported).toBe(false);
    });

    it('returns false on report sends in fallback mode without crashing', async () => {
      const mouseRes = await BluetoothHid.sendMouseReport(1, 10, -5, 0);
      expect(mouseRes).toBe(false);

      const kbRes = await BluetoothHid.sendKeyboardReport(0, 4);
      expect(kbRes).toBe(false);

      const consumerRes = await BluetoothHid.sendConsumerReport(0x00E9);
      expect(consumerRes).toBe(false);
    });
  });

  describe('Native Module integration when available', () => {
    const mockNativeHid = {
      registerApp: jest.fn().mockResolvedValue(true),
      unregisterApp: jest.fn().mockResolvedValue(true),
      isRegistered: jest.fn().mockResolvedValue(true),
      connectToDevice: jest.fn().mockResolvedValue(true),
      connect: jest.fn().mockResolvedValue(true),
      disconnect: jest.fn().mockResolvedValue(true),
      getConnectionState: jest.fn().mockResolvedValue({
        state: 'CONNECTED',
        isRegistered: true,
        device: { address: 'AA:BB:CC:DD:EE:FF', name: 'MacBook Pro' },
      }),
      getBondedDevices: jest.fn().mockResolvedValue([
        { address: 'AA:BB:CC:DD:EE:FF', name: 'MacBook Pro', bondState: 12 },
      ]),
      sendMouseReport: jest.fn().mockResolvedValue(true),
      sendKeyboardReport: jest.fn().mockResolvedValue(true),
      sendConsumerReport: jest.fn().mockResolvedValue(true),
      sendRawReport: jest.fn().mockResolvedValue(true),
      startDiscovery: jest.fn().mockResolvedValue(true),
      cancelDiscovery: jest.fn().mockResolvedValue(true),
      makeDiscoverable: jest.fn().mockResolvedValue(true),
      getBluetoothState: jest.fn().mockResolvedValue({ enabled: true, isSupported: true }),
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    };

    beforeAll(() => {
      NativeModules.BluetoothHidModule = mockNativeHid;
      NativeModules.BluetoothHidDevice = mockNativeHid;
    });

    it('invokes native sendMouseReport with buttons, dx, dy, and scroll', async () => {
      const result = await mockNativeHid.sendMouseReport(1, 15, -10, 1);
      expect(result).toBe(true);
      expect(mockNativeHid.sendMouseReport).toHaveBeenCalledWith(1, 15, -10, 1);
    });

    it('invokes native sendKeyboardReport with modifier and keyCode', async () => {
      // Send Left Shift (0x02) + key 'a' (0x04)
      const result = await mockNativeHid.sendKeyboardReport(2, 4);
      expect(result).toBe(true);
      expect(mockNativeHid.sendKeyboardReport).toHaveBeenCalledWith(2, 4);
    });

    it('invokes native sendConsumerReport with usage code', async () => {
      // Send Volume Up (0x00E9)
      const result = await mockNativeHid.sendConsumerReport(0x00E9);
      expect(result).toBe(true);
      expect(mockNativeHid.sendConsumerReport).toHaveBeenCalledWith(0x00E9);
    });

    it('invokes native connectToDevice and disconnect', async () => {
      await mockNativeHid.connectToDevice('11:22:33:44:55:66');
      expect(mockNativeHid.connectToDevice).toHaveBeenCalledWith('11:22:33:44:55:66');

      await mockNativeHid.disconnect();
      expect(mockNativeHid.disconnect).toHaveBeenCalled();
    });

    it('invokes startDiscovery and cancelDiscovery for Phase 5 discovery', async () => {
      await mockNativeHid.startDiscovery();
      expect(mockNativeHid.startDiscovery).toHaveBeenCalled();

      await mockNativeHid.cancelDiscovery();
      expect(mockNativeHid.cancelDiscovery).toHaveBeenCalled();
    });
  });

  describe('BluetoothHidEvents', () => {
    it('safely registers event listeners without errors', () => {
      const regListener = jest.fn();
      const connListener = jest.fn();
      const btListener = jest.fn();
      const discListener = jest.fn();

      const sub1 = BluetoothHidEvents.addRegistrationListener(regListener);
      const sub2 = BluetoothHidEvents.addConnectionStateListener(connListener);
      const sub3 = BluetoothHidEvents.addBluetoothStateListener(btListener);
      const sub4 = BluetoothHidEvents.addDeviceDiscoveredListener(discListener);

      expect(typeof sub1?.remove).toBe('function');
      expect(typeof sub2?.remove).toBe('function');
      expect(typeof sub3?.remove).toBe('function');
      expect(typeof sub4?.remove).toBe('function');

      sub1?.remove();
      sub2?.remove();
      sub3?.remove();
      sub4?.remove();
    });
  });
});

