import {
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';

export type ConnectionState =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'DISCONNECTING'
  | 'UNKNOWN';

export interface BluetoothDevice {
  address: string;
  name: string;
  bondState?: number;
  isConnected?: boolean;
}

export interface BluetoothConnectionInfo {
  state: ConnectionState;
  rawState?: number;
  isRegistered: boolean;
  device: BluetoothDevice | null;
}

export interface BluetoothState {
  enabled: boolean;
  isSupported: boolean;
}

export interface HidRegistrationEvent {
  registered: boolean;
  deviceAddress?: string;
  deviceName?: string;
}

export interface ConnectionStateChangeEvent {
  state: ConnectionState;
  rawState: number;
  deviceAddress: string;
  deviceName: string;
}

export interface BluetoothStateChangeEvent {
  enabled: boolean;
  state: number;
}

export interface DeviceDiscoveredEvent {
  address: string;
  name: string;
  bondState?: number;
}

/**
 * Strict TypeScript interface for BluetoothHidModule native methods.
 */
export interface BluetoothHidType {
  connectToDevice(deviceAddress: string): Promise<boolean>;
  connect(deviceAddress: string): Promise<boolean>;
  sendKeyboardReport(modifier: number, keyCode: number): Promise<boolean>;
  sendMouseReport(
    buttons: number,
    dx: number,
    dy: number,
    scroll: number,
  ): Promise<boolean>;
  registerApp(): Promise<boolean>;
  unregisterApp(): Promise<boolean>;
  isRegistered(): Promise<boolean>;
  disconnect(): Promise<boolean>;
  getConnectionState(): Promise<BluetoothConnectionInfo>;
  getBondedDevices(): Promise<BluetoothDevice[]>;
  startDiscovery(): Promise<boolean>;
  cancelDiscovery(): Promise<boolean>;
  makeDiscoverable(durationSeconds?: number): Promise<boolean>;
  getBluetoothState(): Promise<BluetoothState>;
  sendKeyboardMultiReport(
    modifier: number,
    k1: number,
    k2: number,
    k3: number,
    k4: number,
    k5: number,
    k6: number,
  ): Promise<boolean>;
}

// Support both BluetoothHidModule and legacy BluetoothHidDevice for compatibility
const NativeModule =
  NativeModules.BluetoothHidModule || NativeModules.BluetoothHidDevice;

const FallbackModule: BluetoothHidType = {
  async connectToDevice(): Promise<boolean> {
    return false;
  },
  async connect(address: string): Promise<boolean> {
    return this.connectToDevice(address);
  },
  async sendKeyboardReport(): Promise<boolean> {
    return false;
  },
  async sendMouseReport(): Promise<boolean> {
    return false;
  },
  async registerApp(): Promise<boolean> {
    return false;
  },
  async unregisterApp(): Promise<boolean> {
    return true;
  },
  async isRegistered(): Promise<boolean> {
    return false;
  },
  async disconnect(): Promise<boolean> {
    return true;
  },
  async getConnectionState(): Promise<BluetoothConnectionInfo> {
    return {
      state: 'DISCONNECTED',
      isRegistered: false,
      device: null,
    };
  },
  async getBondedDevices(): Promise<BluetoothDevice[]> {
    return [];
  },
  async startDiscovery(): Promise<boolean> {
    return false;
  },
  async cancelDiscovery(): Promise<boolean> {
    return true;
  },
  async makeDiscoverable(): Promise<boolean> {
    return false;
  },
  async getBluetoothState(): Promise<BluetoothState> {
    return {
      enabled: false,
      isSupported: false,
    };
  },
  async sendKeyboardMultiReport(): Promise<boolean> {
    return false;
  },
};

export const BluetoothHid: BluetoothHidType =
  Platform.OS === 'android' && NativeModule ? NativeModule : FallbackModule;

const eventEmitter =
  Platform.OS === 'android' && NativeModule
    ? new NativeEventEmitter(NativeModule)
    : null;

const dummySubscription = { remove: () => {} };

export const BluetoothHidEvents = {
  addRegistrationListener(listener: (event: HidRegistrationEvent) => void) {
    return (
      eventEmitter?.addListener(
        'onHidDeviceRegistered',
        listener as (event: any) => void,
      ) ?? dummySubscription
    );
  },

  addConnectionStateListener(
    listener: (event: ConnectionStateChangeEvent) => void,
  ) {
    return (
      eventEmitter?.addListener(
        'onConnectionStateChanged',
        listener as (event: any) => void,
      ) ?? dummySubscription
    );
  },

  addBluetoothStateListener(
    listener: (event: BluetoothStateChangeEvent) => void,
  ) {
    return (
      eventEmitter?.addListener(
        'onBluetoothStateChanged',
        listener as (event: any) => void,
      ) ?? dummySubscription
    );
  },

  addDeviceDiscoveredListener(listener: (event: DeviceDiscoveredEvent) => void) {
    return (
      eventEmitter?.addListener(
        'onDeviceDiscovered',
        listener as (event: any) => void,
      ) ?? dummySubscription
    );
  },

  addDiscoveryFinishedListener(listener: () => void) {
    return (
      eventEmitter?.addListener('onDiscoveryFinished', listener) ??
      dummySubscription
    );
  },
};

export default BluetoothHid;
