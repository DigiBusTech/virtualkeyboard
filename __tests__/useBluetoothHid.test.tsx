import React, { useEffect } from 'react';
import ReactTestRenderer from 'react-test-renderer';
import BluetoothHid from '../src/native/BluetoothHidModule';
import {
  useBluetoothHid,
  UseBluetoothHidReturn,
} from '../src/hooks/useBluetoothHid';
import * as permissionsUtil from '../src/utils/permissions';

jest.mock('../src/native/BluetoothHidModule', () => {
  return {
    __esModule: true,
    default: {
      registerApp: jest.fn().mockResolvedValue(true),
      unregisterApp: jest.fn().mockResolvedValue(true),
      isRegistered: jest.fn().mockResolvedValue(true),
      connectToDevice: jest.fn().mockResolvedValue(true),
      connect: jest.fn().mockResolvedValue(true),
      disconnect: jest.fn().mockResolvedValue(true),
      getConnectionState: jest.fn().mockResolvedValue({
        state: 'DISCONNECTED',
        isRegistered: false,
        device: null,
      }),
      getBondedDevices: jest.fn().mockResolvedValue([
        { address: 'AA:BB:CC:DD:EE:FF', name: 'Work PC', bondState: 12 },
      ]),
      sendMouseReport: jest.fn().mockResolvedValue(true),
      sendKeyboardReport: jest.fn().mockResolvedValue(true),
      sendKeyboardMultiReport: jest.fn().mockResolvedValue(true),
      sendConsumerReport: jest.fn().mockResolvedValue(true),
      sendRawReport: jest.fn().mockResolvedValue(true),
      makeDiscoverable: jest.fn().mockResolvedValue(true),
      getBluetoothState: jest.fn().mockResolvedValue({
        enabled: true,
        isSupported: true,
      }),
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

describe('useBluetoothHid Hook', () => {
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

  function renderHookHarness(callback: (hook: UseBluetoothHidReturn) => void) {
    function Harness() {
      const hook = useBluetoothHid();
      useEffect(() => {
        callback(hook);
      });
      return null;
    }
    return ReactTestRenderer.create(<Harness />);
  }

  it('initializes and loads Bluetooth state and bonded devices', async () => {
    let hookResult: UseBluetoothHidReturn | null = null;
    await ReactTestRenderer.act(async () => {
      renderHookHarness(hook => {
        hookResult = hook;
      });
    });

    expect(hookResult).not.toBeNull();
    expect(hookResult!.isSupported).toBe(true);
    expect(hookResult!.isBluetoothEnabled).toBe(true);
    expect(hookResult!.bondedDevices).toHaveLength(1);
    expect(hookResult!.bondedDevices[0].name).toBe('Work PC');
  });

  it('handles register and unregister actions', async () => {
    let hookResult: UseBluetoothHidReturn | null = null;
    await ReactTestRenderer.act(async () => {
      renderHookHarness(hook => {
        hookResult = hook;
      });
    });

    let regSuccess = false;
    await ReactTestRenderer.act(async () => {
      regSuccess = await hookResult!.register();
    });
    expect(regSuccess).toBe(true);
    expect(BluetoothHid.registerApp).toHaveBeenCalled();

    let unregSuccess = false;
    await ReactTestRenderer.act(async () => {
      unregSuccess = await hookResult!.unregister();
    });
    expect(unregSuccess).toBe(true);
    expect(BluetoothHid.unregisterApp).toHaveBeenCalled();
  });

  it('dispatches mouse reports with dx, dy and buttons', async () => {
    let hookResult: UseBluetoothHidReturn | null = null;
    await ReactTestRenderer.act(async () => {
      renderHookHarness(hook => {
        hookResult = hook;
      });
    });

    let sent = false;
    await ReactTestRenderer.act(async () => {
      sent = await hookResult!.sendMouse(1, 12, -8, 0);
    });

    expect(sent).toBe(true);
    expect(BluetoothHid.sendMouseReport).toHaveBeenCalledWith(1, 12, -8, 0);
  });

  it('dispatches keyboard reports with modifier and key array', async () => {
    let hookResult: UseBluetoothHidReturn | null = null;
    await ReactTestRenderer.act(async () => {
      renderHookHarness(hook => {
        hookResult = hook;
      });
    });

    let sent = false;
    await ReactTestRenderer.act(async () => {
      // Send Left GUI (0x08) + Space (0x2C)
      sent = await hookResult!.sendKeyboard(8, [44]);
    });

    expect(sent).toBe(true);
    expect(BluetoothHid.sendKeyboardReport).toHaveBeenCalledWith(8, 44);
  });

  it('dispatches consumer reports with usage code', async () => {
    let hookResult: UseBluetoothHidReturn | null = null;
    await ReactTestRenderer.act(async () => {
      renderHookHarness(hook => {
        hookResult = hook;
      });
    });

    let sent = false;
    await ReactTestRenderer.act(async () => {
      // Send Mute (0x00E2)
      sent = await hookResult!.sendConsumer(0x00E2);
    });

    expect(sent).toBe(true);
    expect(BluetoothHid.sendConsumerReport).toHaveBeenCalledWith(0x00E2);
  });
});

