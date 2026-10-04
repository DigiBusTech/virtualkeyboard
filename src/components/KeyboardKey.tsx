/* eslint-disable no-bitwise */
import React from 'react';
import { Pressable, Text } from 'react-native';
import { KeyDefinition, MODIFIER_MASK } from '../utils/hidKeycodes';
import { styles } from './VirtualKeyboard.styles';

interface KeyboardKeyProps {
  keyDef: KeyDefinition;
  modifier: number;
  onPressIn: (key: KeyDefinition) => void;
  onPressOut: (key: KeyDefinition) => void;
}

export function KeyboardKey({
  keyDef,
  modifier,
  onPressIn,
  onPressOut,
}: KeyboardKeyProps) {
  const isShift = (modifier & MODIFIER_MASK.LEFT_SHIFT) !== 0;
  const isMod = keyDef.isModifier;
  const isModActive = Boolean(isMod && keyDef.modifierBit && (modifier & keyDef.modifierBit) !== 0);

  let modStyle = undefined;
  if (isModActive) {
    if (keyDef.modifierBit === MODIFIER_MASK.LEFT_SHIFT) modStyle = styles.modShiftActive;
    else if (keyDef.modifierBit === MODIFIER_MASK.LEFT_CTRL) modStyle = styles.modCtrlActive;
    else if (keyDef.modifierBit === MODIFIER_MASK.LEFT_ALT) modStyle = styles.modAltActive;
    else if (keyDef.modifierBit === MODIFIER_MASK.LEFT_GUI) modStyle = styles.modGuiActive;
  }

  const displayLabel =
    isShift && keyDef.shiftLabel
      ? keyDef.shiftLabel
      : isShift && keyDef.label.length === 1
      ? keyDef.label.toUpperCase()
      : keyDef.label;

  return (
    <Pressable
      testID={`keyboard-key-${keyDef.label}`}
      style={({ pressed }) => [
        styles.key,
        keyDef.width ? { flex: keyDef.width } : undefined,
        keyDef.isSpecial ? styles.specialKey : undefined,
        pressed && styles.keyPressed,
        modStyle,
      ]}
      onPressIn={() => onPressIn(keyDef)}
      onPressOut={() => onPressOut(keyDef)}>
      {keyDef.shiftLabel && !isShift && (
        <Text style={styles.shiftSubText}>{keyDef.shiftLabel}</Text>
      )}
      <Text
        style={[
          styles.keyText,
          keyDef.isSpecial ? styles.keyTextSpecial : undefined,
        ]}>
        {displayLabel}
      </Text>
    </Pressable>
  );
}
