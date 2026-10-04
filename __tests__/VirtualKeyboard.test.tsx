import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { VirtualKeyboard } from '../src/components/VirtualKeyboard';
import BluetoothHid from '../src/native/BluetoothHidModule';

jest.mock('../src/native/BluetoothHidModule', () => {
  return {
    __esModule: true,
    default: {
      sendKeyboardReport: jest.fn().mockResolvedValue(true),
      sendKeyboardMultiReport: jest.fn().mockResolvedValue(true),
      getConnectionState: jest.fn().mockResolvedValue({
        state: 'CONNECTED',
        isRegistered: true,
        device: { name: 'MacBook Air', address: 'AA:BB:CC:DD:EE:FF' },
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

describe('VirtualKeyboard Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders virtual keyboard layout with key buttons', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<VirtualKeyboard />);
    });

    const json = JSON.stringify(renderer!.toJSON());
    expect(json).toContain('Space');
    expect(json).toContain('Enter');
    expect(json).toContain('Esc');
    expect(json).toContain('Ctrl');
    expect(json).toContain('Alt');
  });

  it('sends keycode 0x04 on pressing A and sends keycode 0x00 on release', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<VirtualKeyboard />);
    });

    const pressableA = renderer!.root.findByProps({
      testID: 'keyboard-key-A',
    });

    await ReactTestRenderer.act(async () => {
      pressableA.props.onPressIn();
    });

    // Key 'A' HID usage code is 0x04, with 0 modifier
    expect(BluetoothHid.sendKeyboardReport).toHaveBeenCalledWith(0, 4);

    await ReactTestRenderer.act(async () => {
      pressableA.props.onPressOut();
    });

    // On release, send keycode 0x00
    expect(BluetoothHid.sendKeyboardReport).toHaveBeenCalledWith(0, 0);
  });

  it('toggles Shift modifier and latches uppercase/shift symbols', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<VirtualKeyboard />);
    });

    const pressableShift = renderer!.root.findByProps({
      testID: 'keyboard-key-Shift',
    });

    await ReactTestRenderer.act(async () => {
      pressableShift.props.onPressIn();
      pressableShift.props.onPressOut();
    });

    // Now press 'A' with shift latched (modifier = 0x02)
    const pressableA = renderer!.root.findByProps({
      testID: 'keyboard-key-A',
    });

    await ReactTestRenderer.act(async () => {
      pressableA.props.onPressIn();
    });

    // Modifier 2 = Left Shift
    expect(BluetoothHid.sendKeyboardReport).toHaveBeenCalledWith(2, 4);
  });
});
