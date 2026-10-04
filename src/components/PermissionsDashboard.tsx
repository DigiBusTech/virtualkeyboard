import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getAndroidApiVersion,
  getPermissionDescription,
  getPermissionLabel,
  getRequiredBluetoothPermissions,
  isBluetoothHidSupported,
  PermissionRequestResult,
  requestBluetoothPermissions,
} from '../utils/permissions';
import { styles } from './PermissionsDashboard.styles';
import { BluetoothHidControlCard } from './BluetoothHidControlCard';

export function PermissionsDashboard() {
  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState(true);
  const [requestResult, setRequestResult] =
    useState<PermissionRequestResult | null>(null);
  const [supportInfo, setSupportInfo] = useState(isBluetoothHidSupported());

  const handleRequest = useCallback(async () => {
    setLoading(true);
    const support = isBluetoothHidSupported();
    setSupportInfo(support);

    if (support.isSupported) {
      const res = await requestBluetoothPermissions();
      setRequestResult(res);
    } else {
      setRequestResult({
        allGranted: false,
        isSupported: false,
        statuses: {},
        missing: [],
        message: support.reason,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    handleRequest();
  }, [handleRequest]);

  const required = getRequiredBluetoothPermissions();
  const apiVersion = getAndroidApiVersion();
  const safeAreaStyle = isDarkMode ? styles.safeAreaDark : styles.safeAreaLight;
  const cardStyle = isDarkMode ? styles.cardDark : styles.cardLight;
  const textStyle = isDarkMode ? styles.textDark : styles.textLight;
  const descStyle = isDarkMode ? styles.descDark : styles.descLight;

  return (
    <SafeAreaView style={[styles.safeArea, safeAreaStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.badge}>PHASE 1: INITIALIZATION</Text>
          <Text style={[styles.title, textStyle]}>
            Virtual HID Device
          </Text>
          <Text style={styles.subtitle}>
            Serverless Bluetooth Mouse & Keyboard for PC/Mac
          </Text>
        </View>

        {/* Architecture Note Card */}
        <View style={[styles.card, cardStyle]}>
          <Text style={styles.cardHeader}>ARCHITECTURE REQUIREMENT</Text>
          <Text style={[styles.bodyText, descStyle]}>
            Target OS: Android (minSDK 28+). Apple strictly prohibits iOS apps
            from broadcasting standard Bluetooth HID services (UUID 0x1812) via
            CoreBluetooth APIs. This app uses Android BluetoothHidDevice API.
          </Text>
          <View style={styles.row}>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>OS:</Text>
              <Text style={styles.pillValue}>{Platform.OS.toUpperCase()}</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillLabel}>API:</Text>
              <Text style={styles.pillValue}>
                {apiVersion > 0 ? `API ${apiVersion}` : 'N/A'}
              </Text>
            </View>
            <View
              style={[
                styles.pill,
                supportInfo.isSupported
                  ? styles.pillReady
                  : styles.pillIncompatible,
              ]}>
              <Text style={styles.pillLabel}>HID Status:</Text>
              <Text
                style={[
                  styles.pillValue,
                  supportInfo.isSupported
                    ? styles.pillValueReady
                    : styles.pillValueIncompatible,
                ]}>
                {supportInfo.isSupported ? 'Ready' : 'Incompatible'}
              </Text>
            </View>
          </View>
          {!supportInfo.isSupported && supportInfo.reason ? (
            <Text style={styles.errorText}>⚠️ {supportInfo.reason}</Text>
          ) : null}
        </View>

        {/* Permissions Section */}
        <View style={[styles.card, cardStyle]}>
          <View style={styles.betweenRow}>
            <Text style={styles.cardHeader}>BLUETOOTH PERMISSIONS</Text>
            {loading ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <View
                style={[
                  styles.statusTag,
                  requestResult?.allGranted
                    ? styles.statusTagSuccess
                    : styles.statusTagPending,
                ]}>
                <Text
                  style={[
                    styles.statusTagText,
                    requestResult?.allGranted
                      ? styles.statusTagTextSuccess
                      : styles.statusTagTextPending,
                  ]}>
                  {requestResult?.allGranted ? 'ALL GRANTED' : 'ACTION REQUIRED'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.manifestRow}>
            <Text style={styles.manifestTitle}>Manifest Configured:</Text>
            <Text style={styles.manifestList}>
              BLUETOOTH, BLUETOOTH_ADMIN, minSDK 28
            </Text>
          </View>

          {required.map(perm => {
            const isGranted =
              requestResult?.statuses[perm] === 'granted';
            return (
              <View key={perm} style={styles.permItem}>
                <View style={styles.betweenRow}>
                  <Text style={[styles.permTitle, textStyle]}>
                    {getPermissionLabel(perm)}
                  </Text>
                  <Text
                    style={[
                      styles.permTag,
                      isGranted ? styles.permTagGranted : styles.permTagDenied,
                    ]}>
                    {isGranted ? '✓ Granted' : '✗ Denied'}
                  </Text>
                </View>
                <Text style={styles.permDesc}>
                  {getPermissionDescription(perm)}
                </Text>
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.button}
            onPress={handleRequest}
            disabled={loading}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>
              {loading
                ? 'Requesting Permissions...'
                : requestResult?.allGranted
                ? 'Re-check Permissions'
                : 'Grant All Bluetooth Permissions'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Phase 2: Bluetooth HID Controls */}
        {requestResult?.allGranted && <BluetoothHidControlCard />}

        {/* Phase Status Badge */}
        <View
          style={[
            styles.card,
            requestResult?.allGranted
              ? isDarkMode
                ? styles.phaseCardCompleteDark
                : styles.phaseCardCompleteLight
              : isDarkMode
              ? styles.phaseCardDark
              : styles.phaseCardLight,
          ]}>
          <Text
            style={[
              styles.phaseTitle,
              requestResult?.allGranted
                ? styles.phaseTitleComplete
                : isDarkMode
                ? styles.phaseTitleIncompleteDark
                : styles.phaseTitleIncompleteLight,
            ]}>
            {requestResult?.allGranted
              ? '✓ Phase 1 & 2 Complete'
              : 'Phase 1 in Progress'}
          </Text>
          <Text style={[styles.phaseDesc, descStyle]}>
            {requestResult?.allGranted
              ? 'Bluetooth HID Device native module (Kotlin) implemented with composite Mouse & Keyboard descriptor (Report IDs 1 & 2), SDP/QoS settings, bridge methods, and reactive React hook. Ready for Phase 3: Virtual Keyboard.'
              : 'Awaiting permission grants to complete Phase 1 setup.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
