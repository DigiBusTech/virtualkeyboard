import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Trackpad } from '../src/components/Trackpad';
import BluetoothHid from '../src/native/BluetoothHidModule';

jest.mock('../src/native/BluetoothHidModule', () => {
  return {
    __esModule: true,
    default: {
      sendMouseReport: jest.fn().mockResolvedValue(true),
      sendKeyboardReport: jest.fn().mockResolvedValue(true),
      getConnectionState: jest.fn().mockResolvedValue({
        state: 'CONNECTED',
        isRegistered: true,
        device: { name: 'Test PC', address: '11:22:33:44:55:66' },
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

describe('Trackpad Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders trackpad surface and hardware mouse buttons', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<Trackpad />);
    });

    const json = JSON.stringify(renderer!.toJSON());
    expect(json).toContain('LEFT CLICK');
    expect(json).toContain('RIGHT CLICK');
    expect(json).toContain('1 Finger: Move Cursor');
  });

  it('triggers left click report on left click button press', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<Trackpad />);
    });

    const leftClickBtn = renderer!.root.findByProps({
      testID: 'trackpad-left-click',
    });

    await ReactTestRenderer.act(async () => {
      leftClickBtn.props.onPressIn();
    });

    expect(BluetoothHid.sendMouseReport).toHaveBeenCalledWith(1, 0, 0, 0);

    await ReactTestRenderer.act(async () => {
      leftClickBtn.props.onPressOut();
    });

    expect(BluetoothHid.sendMouseReport).toHaveBeenCalledWith(0, 0, 0, 0);
  });

  it('triggers right click report on right click button press', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<Trackpad />);
    });

    const rightClickBtn = renderer!.root.findByProps({
      testID: 'trackpad-right-click',
    });

    await ReactTestRenderer.act(async () => {
      rightClickBtn.props.onPressIn();
    });

    expect(BluetoothHid.sendMouseReport).toHaveBeenCalledWith(2, 0, 0, 0);

    await ReactTestRenderer.act(async () => {
      rightClickBtn.props.onPressOut();
    });

    expect(BluetoothHid.sendMouseReport).toHaveBeenCalledWith(0, 0, 0, 0);
  });
});
