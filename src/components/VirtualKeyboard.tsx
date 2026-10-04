/* eslint-disable no-bitwise */
import React, { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useBluetoothHid } from '../hooks/useBluetoothHid';
import {
  KeyDefinition,
  KEYBOARD_LAYOUT,
  MODIFIER_MASK,
} from '../utils/hidKeycodes';
import { styles } from './VirtualKeyboard.styles';

export function VirtualKeyboard() {
  const { sendKeyboard, connectionState, connectedDevice } = useBluetoothHid();
  const [modifier, setModifier] = useState<number>(MODIFIER_MASK.NONE);
  const [activeKey, setActiveKey] = useState<string | null>(null);

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
      if (key.isModifier) {
        return;
      }
      // Release key by sending keycode 0x00 with active modifiers
      sendKeyboard(modifier, 0);
    },
    [modifier, sendKeyboard],
  );

  const isConnected = connectionState === 'CONNECTED';

  return (
    <View style={styles.container}>
      {/* Keyboard status header */}
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>
          {isConnected
            ? `⌨️ Connected: ${connectedDevice?.name ?? 'Host PC'}`
            : '⚠️ Not Connected to Host'}
        </Text>
        <Text style={styles.activeKeyPreview}>
          {activeKey
            ? `Key: ${activeKey}`
            : activeModifiers
            ? `Active: ${activeModifiers}`
            : ''}
        </Text>
      </View>

      {/* Rows */}
      <View style={styles.keyboardGrid}>
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map(key => {
              const isMod = key.isModifier;
              const isModActive =
                isMod && key.modifierBit && (modifier & key.modifierBit) !== 0;

              const displayLabel =
                isShift && key.shiftLabel
                  ? key.shiftLabel
                  : isShift && key.label.length === 1
                  ? key.label.toUpperCase()
                  : key.label;

              return (
                <Pressable
                  testID={`keyboard-key-${key.label}`}
                  key={`key-${key.label}-${key.code}`}
                  style={({ pressed }) => [
                    styles.key,
                    key.width ? { flex: key.width } : undefined,
                    pressed && styles.keyPressed,
                    isModActive ? styles.modifierActive : undefined,
                  ]}
                  onPressIn={() => handlePressIn(key)}
                  onPressOut={() => handlePressOut(key)}>
                  {key.shiftLabel && !isShift && (
                    <Text style={styles.shiftSubText}>{key.shiftLabel}</Text>
                  )}
                  <Text
                    style={[
                      styles.keyText,
                      isModActive ? styles.keyTextActive : undefined,
                    ]}>
                    {displayLabel}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
