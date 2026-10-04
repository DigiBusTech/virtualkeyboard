/* eslint-disable no-bitwise */
import React, { useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import { KeyDefinition, MODIFIER_MASK } from '../utils/hidKeycodes';
import { styles } from './VirtualKeyboard.styles';

interface KeyboardKeyProps {
  keyDef: KeyDefinition;
  modifier: number;
  onPressIn: (key: KeyDefinition) => void;
  onPressOut: (key: KeyDefinition) => void;
  keyHeight?: number;
}

export function KeyboardKey({
  keyDef,
  modifier,
  onPressIn,
  onPressOut,
  keyHeight,
}: KeyboardKeyProps) {
  const scale = useRef(new Animated.Value(1)).current;

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
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
    }).start();
    onPressIn(keyDef);
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 10,
    }).start();
    onPressOut(keyDef);
  };

  const displayLabel =
    isShift && keyDef.shiftLabel
      ? keyDef.shiftLabel
      : isShift && keyDef.label.length === 1
      ? keyDef.label.toUpperCase()
      : keyDef.label;

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
          keyHeight ? { height: keyHeight } : undefined,
          keyDef.isSpecial && styles.specialKeySurface,
          modStyle,
          { transform: [{ scale }] },
        ]}>
        {keyDef.shiftLabel && !isShift && (
          <Text style={styles.shiftSubText}>{keyDef.shiftLabel}</Text>
        )}
        <Text
          style={[
            styles.keyText,
            keyDef.isSpecial && styles.keyTextSpecial,
            isModActive && styles.keyTextActive,
          ]}
          numberOfLines={1}>
          {displayLabel}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

