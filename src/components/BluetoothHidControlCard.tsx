import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useBluetoothHid } from '../hooks/useBluetoothHid';
import { styles } from './BluetoothHidControlCard.styles';

export function BluetoothHidControlCard() {
  const isDarkMode = useColorScheme() === 'dark';
  const {
    isRegistered,
    isBluetoothEnabled,
    connectionState,
    connectedDevice,
    bondedDevices,
    loading,
    error,
    register,
    unregister,
    connect,
    disconnect,
    makeDiscoverable,
    sendMouse,
    sendKeyboard,
  } = useBluetoothHid();

  const isConnected = connectionState === 'CONNECTED';
  const isConnecting = connectionState === 'CONNECTING';

  const cardBg = isDarkMode ? '#1E293B' : '#FFFFFF';

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <View style={styles.headerRow}>
        <Text style={styles.cardHeader}>PHASE 2: BLUETOOTH HID MODULE</Text>
        <View
          style={[
            styles.statusBadge,
            isConnected
              ? styles.badgeConnected
              : isConnecting
              ? styles.badgeConnecting
              : styles.badgeDisconnected,
          ]}>
          <Text
            style={[
              styles.statusBadgeText,
              isConnected
                ? styles.badgeTextConnected
                : isConnecting
                ? styles.badgeTextConnecting
                : styles.badgeTextDisconnected,
            ]}>
            {connectionState}
          </Text>
        </View>
      </View>

      {/* Info Grid */}
      <View style={styles.infoGrid}>
        <View style={styles.infoPill}>
          <Text style={styles.infoPillLabel}>Bluetooth:</Text>
          <Text style={styles.infoPillValue}>
            {isBluetoothEnabled ? 'ON' : 'OFF'}
          </Text>
        </View>

        <View style={styles.infoPill}>
          <Text style={styles.infoPillLabel}>HID Profile:</Text>
          <Text
            style={[
              styles.infoPillValue,
              isRegistered
                ? styles.pillValueRegistered
                : styles.pillValueInactive,
            ]}>
            {isRegistered ? 'Registered' : 'Inactive'}
          </Text>
        </View>

        <View style={styles.infoPill}>
          <Text style={styles.infoPillLabel}>Host:</Text>
          <Text style={styles.infoPillValue}>
            {connectedDevice ? connectedDevice.name : 'None'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            isRegistered ? styles.secondaryBtn : styles.primaryBtn,
          ]}
          onPress={isRegistered ? unregister : register}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.actionBtnText}>
              {isRegistered ? 'Unregister HID' : 'Register HID Profile'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.secondaryBtn]}
          onPress={() => makeDiscoverable(180)}
          disabled={loading}>
          <Text style={styles.actionBtnText}>Make Discoverable</Text>
        </TouchableOpacity>

        {isConnected && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.dangerBtn]}
            onPress={disconnect}
            disabled={loading}>
            <Text style={styles.actionBtnText}>Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Test Buttons when Connected */}
      {isConnected && (
        <View style={styles.testRow}>
          <TouchableOpacity
            style={styles.testBtn}
            onPress={() => sendMouse(1, 0, 0, 0)}>
            <Text style={styles.testBtnText}>🖱️ Test Left Click</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.testBtn}
            onPress={() => sendKeyboard(0, 4)}>
            <Text style={styles.testBtnText}>⌨️ Test Key 'A'</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bonded Devices Section */}
      <View style={styles.deviceSection}>
        <Text style={styles.sectionTitle}>
          Paired Computers ({bondedDevices.length})
        </Text>
        {bondedDevices.length === 0 ? (
          <Text style={styles.noDevicesText}>
            No paired hosts found. Tap "Make Discoverable" and pair your phone from PC/Mac Bluetooth settings.
          </Text>
        ) : (
          bondedDevices.map(device => {
            const isThisConnected = connectedDevice?.address === device.address;
            return (
              <View key={device.address} style={styles.deviceItem}>
                <View>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceAddress}>{device.address}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.deviceConnectButton,
                    isThisConnected && styles.dangerBtn,
                  ]}
                  onPress={() =>
                    isThisConnected ? disconnect() : connect(device.address)
                  }
                  disabled={loading}>
                  <Text style={styles.deviceConnectButtonText}>
                    {isThisConnected ? 'Disconnect' : 'Connect'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>

      {/* Error message */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      ) : null}
    </View>
  );
}
