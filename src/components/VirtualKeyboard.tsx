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
    isGui ? 'WIN' : null,
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

  const keyHeight = isLandscape
    ? Math.max(34, Math.min(46, (height - 90) / (activeLayout.length || 5)))
    : undefined;

  return (
    <View style={styles.container}>
      {/* Top Header with Status & Mode Selector */}
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
            onPress={() => setMode('qwerty')}
            activeOpacity={0.7}>
            <Text
              style={[styles.modeText, mode === 'qwerty' && styles.modeTextActive]}>
              QWERTY
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modePill, mode === 'functions' && styles.modePillActive]}
            onPress={() => setMode('functions')}
            activeOpacity={0.7}>
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
            onPress={() => setMode('numpad')}
            activeOpacity={0.7}>
            <Text
              style={[styles.modeText, mode === 'numpad' && styles.modeTextActive]}>
              Numpad
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Slim Macro Ribbon directly above keys */}
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
                keyHeight={keyHeight}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}


