import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PairingScreen } from '../src/components/PairingScreen';
import BluetoothHid from '../src/native/BluetoothHidModule';
import * as permissionsUtil from '../src/utils/permissions';

jest.mock('../src/native/BluetoothHidModule', () => {
  return {
    __esModule: true,
    default: {
      registerApp: jest.fn().mockResolvedValue(true),
      unregisterApp: jest.fn().mockResolvedValue(true),
      startDiscovery: jest.fn().mockResolvedValue(true),
      cancelDiscovery: jest.fn().mockResolvedValue(true),
      makeDiscoverable: jest.fn().mockResolvedValue(true),
      connectToDevice: jest.fn().mockResolvedValue(true),
      connect: jest.fn().mockResolvedValue(true),
      disconnect: jest.fn().mockResolvedValue(true),
      getConnectionState: jest.fn().mockResolvedValue({
        state: 'DISCONNECTED',
        isRegistered: true,
        device: null,
      }),
      getBluetoothState: jest.fn().mockResolvedValue({
        enabled: true,
        isSupported: true,
      }),
      getBondedDevices: jest.fn().mockResolvedValue([
        { name: 'Office iMac', address: '11:22:33:44:55:66', bondState: 12 },
      ]),
    },
    BluetoothHidEvents: {
      addRegistrationListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
      addConnectionStateListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
      addBluetoothStateListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
      addDeviceDiscoveredListener: jest.fn((callback) => {
        // Trigger discovered device event
        callback({ name: 'Discovered PC', address: '99:88:77:66:55:44', bondState: 10 });
        return { remove: jest.fn() };
      }),
      addDiscoveryFinishedListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
    },
  };
});

jest.setTimeout(30000);

describe('PairingScreen Component (Phase 5)', () => {
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

  it('renders pairing screen with discovery controls and paired hosts', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<PairingScreen />);
    });

    const json = JSON.stringify(renderer!.toJSON());
    expect(json).toContain('Bluetooth Pairing');
    expect(json).toContain('DISCOVERY CONTROLS');
    expect(json).toContain('Office iMac');
  });

  it('invokes startDiscovery when scan button is pressed', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<PairingScreen />);
    });

    const scanBtn = renderer!.root.findByProps({
      testID: 'btn-scan-devices',
    });

    await ReactTestRenderer.act(async () => {
      scanBtn.props.onPress();
    });

    expect(BluetoothHid.startDiscovery).toHaveBeenCalled();
  });

  it('invokes makeDiscoverable when make discoverable button is pressed', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<PairingScreen />);
    });

    const discBtn = renderer!.root.findByProps({
      testID: 'btn-make-discoverable',
    });

    await ReactTestRenderer.act(async () => {
      discBtn.props.onPress();
    });

    expect(BluetoothHid.makeDiscoverable).toHaveBeenCalledWith(180);
  });

  it('invokes connect when a discovered device is tapped', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<PairingScreen />);
    });

    const discoveredDeviceCard = renderer!.root.findByProps({
      testID: 'discovered-device-99:88:77:66:55:44',
    });

    await ReactTestRenderer.act(async () => {
      discoveredDeviceCard.props.onPress();
    });

    expect(BluetoothHid.connect).toHaveBeenCalledWith('99:88:77:66:55:44');
  });
});
