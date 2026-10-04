/* eslint-disable no-bitwise */
import React, { useCallback, useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useBluetoothHid } from '../hooks/useBluetoothHid';
import {
  FUNCTION_MEDIA_LAYOUT,
  HID_KEY_CODES,
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
  const { theme } = useTheme();
  const { sendKeyboard, sendConsumer, connectionState, connectedDevice } = useBluetoothHid();
  const [mode, setMode] = useState<KeyboardMode>('qwerty');
  const [modifier, setModifier] = useState<number>(MODIFIER_MASK.NONE);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isCapsLock, setIsCapsLock] = useState<boolean>(false);
  const [isForceLandscape, setIsForceLandscape] = useState<boolean>(false);

  const { width, height } = useWindowDimensions();
  const isPhysicalLandscape = width > height;

  const isShift = (modifier & MODIFIER_MASK.LEFT_SHIFT) !== 0;
  const isCtrl = (modifier & MODIFIER_MASK.LEFT_CTRL) !== 0;
  const isAlt = (modifier & MODIFIER_MASK.LEFT_ALT) !== 0;
  const isGui = (modifier & MODIFIER_MASK.LEFT_GUI) !== 0;

  const activeModifiers = [
    isShift ? 'SHIFT' : null,
    isCtrl ? 'CTRL' : null,
    isAlt ? 'ALT' : null,
    isGui ? 'WIN' : null,
    isCapsLock ? 'CAPS' : null,
  ]
    .filter(Boolean)
    .join(' + ');

  const toggleModifier = useCallback((bit: number) => {
    setModifier(prev => prev ^ bit);
  }, []);

  const handlePressIn = useCallback(
    (key: KeyDefinition) => {
      setActiveKey(key.label);
      if (key.isConsumer) {
        sendConsumer(key.code);
        return;
      }
      if (key.code === HID_KEY_CODES.CAPS_LOCK) {
        setIsCapsLock(prev => !prev);
        sendKeyboard(modifier, HID_KEY_CODES.CAPS_LOCK);
        return;
      }
      if (key.isModifier && key.modifierBit) {
        toggleModifier(key.modifierBit);
        return;
      }

      // Strip Shift from arrow keys so cursor moves cleanly without highlighting/selecting text
      const effectiveModifier = key.isArrow
        ? modifier & ~MODIFIER_MASK.LEFT_SHIFT & ~MODIFIER_MASK.RIGHT_SHIFT
        : modifier;

      sendKeyboard(effectiveModifier, key.code);

      // Auto-unlatch single-press Shift after typing a character
      if (!key.isModifier && !key.isArrow && (modifier & MODIFIER_MASK.LEFT_SHIFT)) {
        setModifier(prev => prev & ~MODIFIER_MASK.LEFT_SHIFT);
      }
    },
    [modifier, sendConsumer, sendKeyboard, toggleModifier],
  );

  const handlePressOut = useCallback(
    (key: KeyDefinition) => {
      setActiveKey(null);
      if (key.isConsumer) {
        sendConsumer(0);
        return;
      }
      if (key.isModifier) return;
      const effectiveModifier = key.isArrow
        ? modifier & ~MODIFIER_MASK.LEFT_SHIFT & ~MODIFIER_MASK.RIGHT_SHIFT
        : modifier;
      sendKeyboard(effectiveModifier, 0);
    },
    [modifier, sendConsumer, sendKeyboard],
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

  const sendConsumerPress = useCallback(
    (code: number) => {
      sendConsumer(code);
      setTimeout(() => {
        sendConsumer(0);
      }, 50);
    },
    [sendConsumer],
  );

  const isConnected = connectionState === 'CONNECTED';

  const activeLayout =
    mode === 'functions'
      ? FUNCTION_MEDIA_LAYOUT
      : mode === 'numpad'
      ? NUMPAD_LAYOUT
      : QWERTY_LAYOUT;

  const landscapeKeyHeight = isPhysicalLandscape
    ? Math.max(26, Math.min(36, (height - 110) / (activeLayout.length || 5)))
    : Math.max(24, Math.min(30, (width - 170) / (activeLayout.length || 5)));

  const keyHeight = isPhysicalLandscape ? landscapeKeyHeight : 44;

  const renderKeyboardContent = (isLandscapeView: boolean) => (
    <>
      {/* Top Header with Status, Mode Selector & Rotate Toggle */}
      <View
        style={[
          styles.headerBar,
          { backgroundColor: theme.bgCard, borderColor: theme.borderSubtle },
        ]}>
        <View style={styles.headerLeft}>
          <Text
            style={
              isConnected ? styles.hostBadge : styles.hostBadgeDisconnected
            }>
            {isConnected ? `● ${connectedDevice?.name ?? 'Host PC'}` : '○ Offline'}
          </Text>
        </View>

        {/* Mode Selector */}
        <View style={[styles.modeSelector, { backgroundColor: theme.bgInput }]}>
          <TouchableOpacity
            testID="mode-qwerty"
            style={[styles.modePill, mode === 'qwerty' && styles.modePillActive]}
            onPress={() => setMode('qwerty')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.modeText,
                mode === 'qwerty' && styles.modeTextActive,
              ]}>
              QWERTY
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="mode-functions"
            style={[
              styles.modePill,
              mode === 'functions' && styles.modePillActive,
            ]}
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
            testID="mode-numpad"
            style={[styles.modePill, mode === 'numpad' && styles.modePillActive]}
            onPress={() => setMode('numpad')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.modeText,
                mode === 'numpad' && styles.modeTextActive,
              ]}>
              Numpad
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dedicated Keyboard-Only Rotate Toggle */}
        <TouchableOpacity
          style={[
            styles.rotateButton,
            {
              backgroundColor: isLandscapeView ? theme.accentBlue : theme.bgSurface,
              borderColor: isLandscapeView ? theme.accentBlue : theme.borderSubtle,
            },
          ]}
          onPress={() => setIsForceLandscape(prev => !prev)}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.rotateButtonText,
              { color: isLandscapeView ? '#FFFFFF' : theme.accentBlue },
            ]}>
            {isLandscapeView ? '📱 Exit' : '🔄 Landscape'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slim Macro Ribbon directly above keys */}
      <QuickActionBar onSendCombo={sendCombo} onSendConsumer={sendConsumerPress} />

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
                keyHeight={isLandscapeView ? landscapeKeyHeight : keyHeight}
                isCapsLockActive={isCapsLock}
              />
            ))}
          </View>
        ))}
      </View>
    </>
  );

  return (
    <>
      {/* Normal View inside screen flow */}
      <View
        style={[
          styles.container,
          { backgroundColor: theme.bgDark },
          isPhysicalLandscape && styles.containerLandscape,
        ]}>
        {renderKeyboardContent(isPhysicalLandscape)}
      </View>

      {/* Fullscreen Rotated Modal when explicitly activated on portrait */}
      {isForceLandscape && !isPhysicalLandscape && (
        <Modal
          visible={true}
          animationType="fade"
          transparent={false}
          onRequestClose={() => setIsForceLandscape(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.bgDark,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: height,
                height: width,
                transform: [{ rotate: '90deg' }],
                paddingHorizontal: 28,
                paddingTop: 10,
                paddingBottom: 48,
                justifyContent: 'space-between',
                backgroundColor: theme.bgDark,
              }}>
              {renderKeyboardContent(true)}
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}


