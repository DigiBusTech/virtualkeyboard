/* eslint-disable no-bitwise */
import React, { useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { KeyDefinition, MODIFIER_MASK } from '../utils/hidKeycodes';
import { styles } from './VirtualKeyboard.styles';

interface KeyboardKeyProps {
  keyDef: KeyDefinition;
  modifier: number;
  onPressIn: (key: KeyDefinition) => void;
  onPressOut: (key: KeyDefinition) => void;
  keyHeight?: number;
  isCapsLockActive?: boolean;
}

export function KeyboardKey({
  keyDef,
  modifier,
  onPressIn,
  onPressOut,
  keyHeight,
  isCapsLockActive = false,
}: KeyboardKeyProps) {
  const { theme, isDark } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const isShift = (modifier & MODIFIER_MASK.LEFT_SHIFT) !== 0;
  const isMod = keyDef.isModifier;
  const isModActive = Boolean(
    isMod && keyDef.modifierBit && (modifier & keyDef.modifierBit) !== 0,
  );

  let modStyle = undefined;
  if (isModActive) {
    if (keyDef.modifierBit === MODIFIER_MASK.LEFT_SHIFT) {
      modStyle = styles.modShiftActive;
    } else if (keyDef.modifierBit === MODIFIER_MASK.LEFT_CTRL) {
      modStyle = styles.modCtrlActive;
    } else if (keyDef.modifierBit === MODIFIER_MASK.LEFT_ALT) {
      modStyle = styles.modAltActive;
    } else if (keyDef.modifierBit === MODIFIER_MASK.LEFT_GUI) {
      modStyle = styles.modGuiActive;
    }
  }

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
    }).start();
    onPressIn(keyDef);
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 10,
    }).start();
    onPressOut(keyDef);
  };

  // If Caps Lock or Shift is active on letter keys
  const isCased = (isShift || isCapsLockActive) && keyDef.label.length === 1 && keyDef.code >= 4 && keyDef.code <= 29;

  const displayLabel =
    isShift && keyDef.shiftLabel
      ? keyDef.shiftLabel
      : isCased
      ? keyDef.label.toUpperCase()
      : keyDef.label;

  // Theme dynamic colors
  const keyBg = isPressed
    ? theme.accentBlue
    : isModActive
    ? isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(37, 99, 235, 0.2)'
    : keyDef.isArrow
    ? isDark ? '#1F2430' : '#E2E8F0'
    : keyDef.isSpecial
    ? isDark ? '#1C1F29' : '#EDE8F5'
    : theme.bgKey;

  const textColor = isPressed
    ? '#FFFFFF'
    : isModActive
    ? theme.textHighlight
    : keyDef.isArrow
    ? theme.accentBlue
    : keyDef.isSpecial
    ? theme.textPrimary
    : theme.textSecondary;

  const baseFontSize =
    keyHeight && keyHeight < 36
      ? keyDef.isArrow
        ? 14
        : displayLabel.length > 4
        ? 9
        : displayLabel.length > 2
        ? 10
        : 12
      : keyDef.isArrow
      ? 18
      : displayLabel.length > 4
      ? 9
      : displayLabel.length > 2
      ? 11
      : 15;

  return (
    <Pressable
      testID={`keyboard-key-${keyDef.label}`}
      style={[
        styles.keyWrapper,
        keyDef.width ? { flex: keyDef.width } : undefined,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.keySurface,
          {
            backgroundColor: keyBg,
            borderColor: isPressed
              ? theme.accentCyan
              : isModActive
              ? theme.accentBlue
              : theme.keyBorder,
          },
          keyHeight ? { height: keyHeight } : undefined,
          keyDef.isSpecial && styles.specialKeySurface,
          keyDef.isArrow && styles.arrowKeySurface,
          modStyle,
          { transform: [{ scale }] },
        ]}>
        {/* Caps Lock indicator light */}
        {keyDef.isCapsLock && (
          <View
            style={[
              styles.capsIndicatorDot,
              isCapsLockActive && styles.capsIndicatorDotActive,
            ]}
          />
        )}

        {/* Shift secondary symbol */}
        {keyDef.shiftLabel && !isShift && (
          <Text style={[styles.shiftSubText, { color: theme.textMuted }]}>
            {keyDef.shiftLabel}
          </Text>
        )}

        <Text
          style={[
            styles.keyText,
            {
              color: textColor,
              fontSize: baseFontSize,
            },
            keyDef.isSpecial && styles.keyTextSpecial,
            keyDef.isArrow && styles.arrowKeyText,
            (isModActive || isPressed) && styles.keyTextActive,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.7}>
          {displayLabel}
        </Text>
      </Animated.View>
    </Pressable>
  );
}


