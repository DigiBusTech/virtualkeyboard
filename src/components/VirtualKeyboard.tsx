/* eslint-disable no-bitwise */
import React, { useCallback, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useBluetoothHid } from '../hooks/useBluetoothHid';
import {
  FUNCTION_MEDIA_LAYOUT,
  KeyDefinition,
  MODIFIER_MASK,
  NUMPAD_LAYOUT,
  QWERTY_LAYOUT,
} from '../utils/hidKeycodes';
import { KeyboardKey } from './KeyboardKey';
import { QuickActionBar } from './QuickActionBar';
import { styles } from './VirtualKeyboard.styles';

export type KeyboardMode = 'qwerty' | 'functions' | 'numpad';

export function VirtualKeyboard() {
  const { sendKeyboard, connectionState, connectedDevice } = useBluetoothHid();
  const [mode, setMode] = useState<KeyboardMode>('qwerty');
  const [modifier, setModifier] = useState<number>(MODIFIER_MASK.NONE);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isRotated, setIsRotated] = useState<boolean>(false);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const isShift = (modifier & MODIFIER_MASK.LEFT_SHIFT) !== 0;
  const isCtrl = (modifier & MODIFIER_MASK.LEFT_CTRL) !== 0;
  const isAlt = (modifier & MODIFIER_MASK.LEFT_ALT) !== 0;
  const isGui = (modifier & MODIFIER_MASK.LEFT_GUI) !== 0;

  const activeModifiers = [
    isShift ? 'SHIFT' : null,
    isCtrl ? 'CTRL' : null,
    isAlt ? 'ALT' : null,
    isGui ? 'WIN/CMD' : null,
  ]
    .filter(Boolean)
    .join(' + ');

  const toggleModifier = useCallback((bit: number) => {
    setModifier(prev => prev ^ bit);
  }, []);

  const handlePressIn = useCallback(
    (key: KeyDefinition) => {
      setActiveKey(key.label);
      if (key.isModifier && key.modifierBit) {
        toggleModifier(key.modifierBit);
        return;
      }
      sendKeyboard(modifier, key.code);
    },
    [modifier, sendKeyboard, toggleModifier],
  );

  const handlePressOut = useCallback(
    (key: KeyDefinition) => {
      setActiveKey(null);
      if (key.isModifier) return;
      sendKeyboard(modifier, 0);
    },
    [modifier, sendKeyboard],
  );

  const sendCombo = useCallback(
    (modBit: number, code: number) => {
      sendKeyboard(modBit, code);
      setTimeout(() => {
        sendKeyboard(MODIFIER_MASK.NONE, 0);
      }, 50);
    },
    [sendKeyboard],
  );

  const isConnected = connectionState === 'CONNECTED';

  const activeLayout =
    mode === 'functions'
      ? FUNCTION_MEDIA_LAYOUT
      : mode === 'numpad'
      ? NUMPAD_LAYOUT
      : QWERTY_LAYOUT;

  return (
    <View style={[styles.container, isRotated && !isLandscape && styles.rotatedContainer]}>
      {/* Top Header with Status, Modes & Rotate Toggle */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Text
            style={
              isConnected ? styles.hostBadge : styles.hostBadgeDisconnected
            }>
            {isConnected ? `● ${connectedDevice?.name ?? 'Host PC'}` : '○ Offline'}
          </Text>
        </View>

        {/* Mode Selector */}
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modePill, mode === 'qwerty' && styles.modePillActive]}
            onPress={() => setMode('qwerty')}>
            <Text
              style={[styles.modeText, mode === 'qwerty' && styles.modeTextActive]}>
              QWERTY
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modePill, mode === 'functions' && styles.modePillActive]}
            onPress={() => setMode('functions')}>
            <Text
              style={[
                styles.modeText,
                mode === 'functions' && styles.modeTextActive,
              ]}>
              F-Keys
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modePill, mode === 'numpad' && styles.modePillActive]}
            onPress={() => setMode('numpad')}>
            <Text
              style={[styles.modeText, mode === 'numpad' && styles.modeTextActive]}>
              Numpad
            </Text>
          </TouchableOpacity>
        </View>

        {/* In-app Rotation Toggle */}
        <TouchableOpacity
          style={styles.rotateButton}
          onPress={() => setIsRotated(prev => !prev)}
          activeOpacity={0.7}>
          <Text style={styles.rotateButtonText}>
            {isRotated ? '📱 Normal' : '🔄 Rotate'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Action Shortcuts Strip */}
      <QuickActionBar onSendCombo={sendCombo} />

      {/* Key Display Toast */}
      {activeKey && (
        <View style={styles.activeKeyToast}>
          <Text style={styles.activeKeyToastText}>
            {activeKey} {activeModifiers ? `(${activeModifiers})` : ''}
          </Text>
        </View>
      )}

      {/* Main Keys Matrix */}
      <View style={styles.keyboardSurface}>
        {activeLayout.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map(key => (
              <KeyboardKey
                key={`key-${key.label}-${key.code}`}
                keyDef={key}
                modifier={modifier}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

