import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PermissionsDashboard } from '../src/components/PermissionsDashboard';
import * as permissionsUtil from '../src/utils/permissions';

jest.setTimeout(15000);

describe('PermissionsDashboard Component', () => {
  beforeEach(() => {
    jest.spyOn(permissionsUtil, 'isBluetoothHidSupported').mockReturnValue({
      isSupported: true,
      platform: 'android',
      apiVersion: 34,
    });

    jest
      .spyOn(permissionsUtil, 'requestBluetoothPermissions')
      .mockResolvedValue({
        allGranted: true,
        isSupported: true,
        statuses: {
          'android.permission.BLUETOOTH_CONNECT': 'granted',
          'android.permission.BLUETOOTH_ADVERTISE': 'granted',
          'android.permission.BLUETOOTH_SCAN': 'granted',
        },
        missing: [],
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly and displays title and permissions', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider
          initialMetrics={{
            frame: { x: 0, y: 0, width: 390, height: 844 },
            insets: { top: 47, left: 0, right: 0, bottom: 34 },
          }}>
          <PermissionsDashboard />
        </SafeAreaProvider>,
      );
    });

    const json = JSON.stringify(renderer!.toJSON());
    expect(json).toContain('Virtual HID Device');
    expect(json).toContain('PHASE 1: INITIALIZATION');
    expect(json).toContain('ARCHITECTURE REQUIREMENT');
    expect(json).toContain('PHASE 2: BLUETOOTH HID MODULE');
  });
});

