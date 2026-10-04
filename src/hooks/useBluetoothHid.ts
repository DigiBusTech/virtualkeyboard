import { useCallback, useEffect, useState } from 'react';
import BluetoothHid, {
  BluetoothConnectionInfo,
  BluetoothDevice,
  BluetoothHidEvents,
  ConnectionState,
} from '../native/BluetoothHidModule';
import { isBluetoothHidSupported } from '../utils/permissions';

export interface UseBluetoothHidReturn {
  isSupported: boolean;
  isRegistered: boolean;
  isBluetoothEnabled: boolean;
  connectionState: ConnectionState;
  connectedDevice: BluetoothDevice | null;
  bondedDevices: BluetoothDevice[];
  discoveredDevices: BluetoothDevice[];
  isDiscovering: boolean;
  loading: boolean;
  error: string | null;
  register(): Promise<boolean>;
  unregister(): Promise<boolean>;
  connect(address: string): Promise<boolean>;
  disconnect(): Promise<boolean>;
  refreshDevices(): Promise<void>;
  startDiscovery(): Promise<boolean>;
  cancelDiscovery(): Promise<boolean>;
  makeDiscoverable(seconds?: number): Promise<boolean>;
  sendMouse(
    buttons: number,
    dx: number,
    dy: number,
    wheel?: number,
  ): Promise<boolean>;
  sendKeyboard(
    modifier: number,
    keyCodeOrKeys: number | number[],
  ): Promise<boolean>;
  sendConsumer(usageCode: number): Promise<boolean>;
}

export function useBluetoothHid(): UseBluetoothHidReturn {
  const [isSupported] = useState<boolean>(() => isBluetoothHidSupported().isSupported);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState<boolean>(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>('DISCONNECTED');
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [bondedDevices, setBondedDevices] = useState<BluetoothDevice[]>([]);
  const [discoveredDevices, setDiscoveredDevices] = useState<BluetoothDevice[]>([]);
  const [isDiscovering, setIsDiscovering] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshState = useCallback(async () => {
    if (!isSupported) return;
    try {
      const btState = await BluetoothHid.getBluetoothState();
      setIsBluetoothEnabled(btState.enabled);

      const connInfo: BluetoothConnectionInfo = await BluetoothHid.getConnectionState();
      setIsRegistered(connInfo.isRegistered);
      setConnectionState(connInfo.state);
      setConnectedDevice(connInfo.device);

      const devices = await BluetoothHid.getBondedDevices();
      setBondedDevices(devices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to query Bluetooth state');
    }
  }, [isSupported]);

  useEffect(() => {
    refreshState();

    if (isSupported && typeof BluetoothHid.registerApp === 'function') {
      BluetoothHid.registerApp()
        .then(() => refreshState())
        .catch(() => {});
    }

    const regSub = BluetoothHidEvents.addRegistrationListener(event => {
      setIsRegistered(event.registered);
    });

    const connSub = BluetoothHidEvents.addConnectionStateListener(event => {
      setConnectionState(event.state);
      if (event.state === 'CONNECTED') {
        setConnectedDevice({
          address: event.deviceAddress,
          name: event.deviceName,
          isConnected: true,
        });
      } else if (event.state === 'DISCONNECTED') {
        setConnectedDevice(null);
      }
    });

    const btSub = BluetoothHidEvents.addBluetoothStateListener(event => {
      setIsBluetoothEnabled(event.enabled);
    });

    const discSub = BluetoothHidEvents.addDeviceDiscoveredListener(device => {
      setDiscoveredDevices(prev => {
        if (prev.some(d => d.address === device.address)) return prev;
        return [...prev, device];
      });
    });

    const finishSub = BluetoothHidEvents.addDiscoveryFinishedListener(() => {
      setIsDiscovering(false);
    });

    return () => {
      regSub?.remove();
      connSub?.remove();
      btSub?.remove();
      discSub?.remove();
      finishSub?.remove();
    };
  }, [isSupported, refreshState]);

  const register = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await BluetoothHid.registerApp();
      await refreshState();
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshState]);

  const unregister = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await BluetoothHid.unregisterApp();
      setIsRegistered(false);
      setConnectedDevice(null);
      setConnectionState('DISCONNECTED');
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unregistration failed';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const connect = useCallback(
    async (address: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        if (!isRegistered && typeof BluetoothHid.registerApp === 'function') {
          await BluetoothHid.registerApp().catch(() => {});
        }
        const res = await BluetoothHid.connect(address);
        return res;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Connection failed';
        setError(msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isRegistered],
  );

  const disconnect = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await BluetoothHid.disconnect();
      setConnectedDevice(null);
      setConnectionState('DISCONNECTED');
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Disconnect failed';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDevices = useCallback(async (): Promise<void> => {
    try {
      const devices = await BluetoothHid.getBondedDevices();
      setBondedDevices(devices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch devices');
    }
  }, []);

  const startDiscovery = useCallback(async (): Promise<boolean> => {
    setError(null);
    setDiscoveredDevices([]);
    try {
      const started = await BluetoothHid.startDiscovery();
      setIsDiscovering(started);
      return started;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Discovery failed';
      setError(msg);
      setIsDiscovering(false);
      return false;
    }
  }, []);

  const cancelDiscovery = useCallback(async (): Promise<boolean> => {
    try {
      const canceled = await BluetoothHid.cancelDiscovery();
      setIsDiscovering(false);
      return canceled;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Cancel discovery failed';
      setError(msg);
      return false;
    }
  }, []);

  const makeDiscoverable = useCallback(
    async (seconds: number = 120): Promise<boolean> => {
      try {
        return await BluetoothHid.makeDiscoverable(seconds);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to make discoverable');
        return false;
      }
    },
    [],
  );

  const sendMouse = useCallback(
    async (
      buttons: number,
      dx: number,
      dy: number,
      wheel: number = 0,
    ): Promise<boolean> => {
      try {
        return await BluetoothHid.sendMouseReport(buttons, dx, dy, wheel);
      } catch {
        return false;
      }
    },
    [],
  );

  const sendKeyboard = useCallback(
    async (
      modifier: number,
      keyCodeOrKeys: number | number[],
    ): Promise<boolean> => {
      try {
        if (typeof keyCodeOrKeys === 'number') {
          return await BluetoothHid.sendKeyboardReport(modifier, keyCodeOrKeys);
        }
        if (keyCodeOrKeys.length <= 1) {
          return await BluetoothHid.sendKeyboardReport(
            modifier,
            keyCodeOrKeys[0] ?? 0,
          );
        }
        return await BluetoothHid.sendKeyboardMultiReport(
          modifier,
          keyCodeOrKeys[0] ?? 0,
          keyCodeOrKeys[1] ?? 0,
          keyCodeOrKeys[2] ?? 0,
          keyCodeOrKeys[3] ?? 0,
          keyCodeOrKeys[4] ?? 0,
          keyCodeOrKeys[5] ?? 0,
        );
      } catch {
        return false;
      }
    },
    [],
  );

  const sendConsumer = useCallback(
    async (usageCode: number): Promise<boolean> => {
      try {
        return await BluetoothHid.sendConsumerReport(usageCode);
      } catch {
        return false;
      }
    },
    [],
  );

  return {
    isSupported,
    isRegistered,
    isBluetoothEnabled,
    connectionState,
    connectedDevice,
    bondedDevices,
    discoveredDevices,
    isDiscovering,
    loading,
    error,
    register,
    unregister,
    connect,
    disconnect,
    refreshDevices,
    startDiscovery,
    cancelDiscovery,
    makeDiscoverable,
    sendMouse,
    sendKeyboard,
    sendConsumer,
  };
}
