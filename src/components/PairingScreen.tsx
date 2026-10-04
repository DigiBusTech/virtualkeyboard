import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBluetoothHid } from '../hooks/useBluetoothHid';
import { styles } from './PairingScreen.styles';

export function PairingScreen() {
  const {
    isDiscovering,
    discoveredDevices,
    bondedDevices,
    connectedDevice,
    connectionState,
    loading,
    error,
    startDiscovery,
    cancelDiscovery,
    connect,
    disconnect,
    makeDiscoverable,
  } = useBluetoothHid();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isDiscovering) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.7,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isDiscovering, pulseAnim]);

  const isConnected = connectionState === 'CONNECTED';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Bluetooth Pairing</Text>
        <Text style={styles.subtitle}>
          Scan for nearby computers or make your phone discoverable to pair with PC/Mac.
        </Text>
      </View>

      {/* Discovery Actions */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>DISCOVERY CONTROLS</Text>
          {isDiscovering && <ActivityIndicator size="small" color="#3B82F6" />}
        </View>

        <View style={styles.actionRow}>
          <Animated.View style={[{ flex: 1, opacity: pulseAnim }]}>
            <TouchableOpacity
              testID="btn-scan-devices"
              style={[styles.primaryBtn, isDiscovering && styles.stopBtn]}
              onPress={isDiscovering ? cancelDiscovery : startDiscovery}
              disabled={loading}
              activeOpacity={0.8}>
              {isDiscovering ? (
                <Text style={styles.btnText}>Stop Scanning</Text>
              ) : (
                <Text style={styles.btnText}>Scan for Nearby PCs</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            testID="btn-make-discoverable"
            style={styles.secondaryBtn}
            onPress={() => makeDiscoverable(180)}
            disabled={loading}
            activeOpacity={0.8}>
            <Text style={styles.btnText}>Make Discoverable</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>How Pairing Works</Text>
          <Text style={styles.infoBoxText}>
            1. Tap "Make Discoverable" on your phone.{'\n'}
            2. Open Bluetooth Settings on your PC or Mac.{'\n'}
            3. Select this phone from the device list to pair.{'\n'}
            Zero drivers or software needed on the host computer!
          </Text>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
      {/* Discovered Nearby Devices */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>
            DISCOVERED COMPUTERS ({discoveredDevices.length})
          </Text>
          {isDiscovering && <ActivityIndicator size="small" color="#38BDF8" />}
        </View>

        {discoveredDevices.length === 0 ? (
          <Text style={styles.emptyStateText}>
            {isDiscovering
              ? 'Scanning for nearby Bluetooth devices...'
              : 'No nearby devices found. Tap "Scan for Nearby PCs" above.'}
          </Text>
        ) : (
          <View style={styles.deviceList}>
            {discoveredDevices.map(device => (
              <TouchableOpacity
                key={`discovered-${device.address}`}
                testID={`discovered-device-${device.address}`}
                style={styles.deviceCard}
                onPress={() => connect(device.address)}
                activeOpacity={0.7}>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>
                    {device.name || 'Unnamed Device'}
                  </Text>
                  <Text style={styles.deviceAddress}>{device.address}</Text>
                </View>
                <View style={styles.connectBtn}>
                  <Text style={styles.connectBtnText}>Connect</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Paired / Bonded Devices */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>
            PAIRED HOSTS ({bondedDevices.length})
          </Text>
          {isConnected && (
            <Text style={styles.cardTitle}>
              CONNECTED: {connectedDevice?.name ?? 'Active Host'}
            </Text>
          )}
        </View>

        {bondedDevices.length === 0 ? (
          <Text style={styles.emptyStateText}>
            No paired hosts yet. Pair with your PC/Mac to get started.
          </Text>
        ) : (
          <View style={styles.deviceList}>
            {bondedDevices.map(device => {
              const isThisConnected = connectedDevice?.address === device.address;
              return (
                <View
                  key={`bonded-${device.address}`}
                  style={[
                    styles.deviceCard,
                    isThisConnected && styles.deviceCardActive,
                  ]}>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    <Text style={styles.deviceAddress}>{device.address}</Text>
                  </View>
                  <TouchableOpacity
                    testID={`bonded-connect-${device.address}`}
                    style={[
                      styles.connectBtn,
                      isThisConnected && styles.disconnectBtn,
                    ]}
                    onPress={() =>
                      isThisConnected ? disconnect() : connect(device.address)
                    }
                    disabled={loading}>
                    <Text style={styles.connectBtnText}>
                      {isThisConnected ? 'Disconnect' : 'Connect'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </View>

    </ScrollView>
  );
}
