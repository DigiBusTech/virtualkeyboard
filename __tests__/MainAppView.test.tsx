import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainAppView } from '../src/components/MainAppView';
import * as permissionsUtil from '../src/utils/permissions';

jest.mock('../src/native/BluetoothHidModule', () => {
  return {
    __esModule: true,
    default: {
      registerApp: jest.fn().mockResolvedValue(true),
      unregisterApp: jest.fn().mockResolvedValue(true),
      sendMouseReport: jest.fn().mockResolvedValue(true),
      sendKeyboardReport: jest.fn().mockResolvedValue(true),
      getConnectionState: jest.fn().mockResolvedValue({
        state: 'CONNECTED',
        isRegistered: true,
        device: { name: 'Work PC', address: '11:22:33:44:55:66' },
      }),
      getBluetoothState: jest.fn().mockResolvedValue({
        enabled: true,
        isSupported: true,
      }),
      getBondedDevices: jest.fn().mockResolvedValue([]),
    },
    BluetoothHidEvents: {
      addRegistrationListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
      addConnectionStateListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
      addBluetoothStateListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
      addDeviceDiscoveredListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
      addDiscoveryFinishedListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
    },
  };
});

describe('MainAppView Component', () => {
  beforeEach(() => {
    jest.spyOn(permissionsUtil, 'isBluetoothHidSupported').mockReturnValue({
      isSupported: true,
      platform: 'android',
      apiVersion: 33,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders trackpad tab by default and switches between tabs', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider
          initialMetrics={{
            frame: { x: 0, y: 0, width: 390, height: 844 },
            insets: { top: 47, left: 0, right: 0, bottom: 34 },
          }}>
          <MainAppView />
        </SafeAreaProvider>,
      );
    });

    let json = JSON.stringify(renderer!.toJSON());
    expect(json).toContain('Trackpad');
    expect(json).toContain('Keyboard');
    expect(json).toContain('Pairing');
    expect(json).toContain('Setup');
    expect(json).toContain('LEFT CLICK');

    // Switch to Keyboard tab
    const keyboardTabBtn = renderer!.root.findByProps({
      testID: 'tab-keyboard',
    });

    await ReactTestRenderer.act(async () => {
      keyboardTabBtn.props.onPress();
    });

    json = JSON.stringify(renderer!.toJSON());
    expect(json).toContain('Space');
    expect(json).toContain('Enter');

    // Switch to Pairing tab
    const pairingTabBtn = renderer!.root.findByProps({
      testID: 'tab-pairing',
    });

    await ReactTestRenderer.act(async () => {
      pairingTabBtn.props.onPress();
    });

    json = JSON.stringify(renderer!.toJSON());
    expect(json).toContain('Bluetooth Pairing');
    expect(json).toContain('DISCOVERY CONTROLS');

    // Switch to Setup (Bluetooth permissions) tab
    const bluetoothTabBtn = renderer!.root.findByProps({
      testID: 'tab-bluetooth',
    });

    await ReactTestRenderer.act(async () => {
      bluetoothTabBtn.props.onPress();
    });

    json = JSON.stringify(renderer!.toJSON());
    expect(json).toContain('ARCHITECTURE REQUIREMENT');
  });
});
