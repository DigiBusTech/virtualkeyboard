import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { HID_KEY_CODES, MODIFIER_MASK } from '../utils/hidKeycodes';
import { styles } from './VirtualKeyboard.styles';

interface QuickActionBarProps {
  onSendCombo: (modBit: number, code: number) => void;
}

export function QuickActionBar({ onSendCombo }: QuickActionBarProps) {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.quickActionBar}>
      <TouchableOpacity
        style={styles.quickActionKey}
        onPress={() => onSendCombo(MODIFIER_MASK.LEFT_CTRL, HID_KEY_CODES.C)}>
        <Text style={styles.quickActionText}>Copy (Ctrl+C)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionKey}
        onPress={() => onSendCombo(MODIFIER_MASK.LEFT_CTRL, HID_KEY_CODES.V)}>
        <Text style={styles.quickActionText}>Paste (Ctrl+V)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionKey}
        onPress={() => onSendCombo(MODIFIER_MASK.LEFT_CTRL, HID_KEY_CODES.A)}>
        <Text style={styles.quickActionText}>Select All (Ctrl+A)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionKey}
        onPress={() => onSendCombo(MODIFIER_MASK.LEFT_CTRL, HID_KEY_CODES.Z)}>
        <Text style={styles.quickActionText}>Undo (Ctrl+Z)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionKey}
        onPress={() => onSendCombo(MODIFIER_MASK.LEFT_ALT, HID_KEY_CODES.TAB)}>
        <Text style={styles.quickActionText}>Alt+Tab</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionKey}
        onPress={() => onSendCombo(MODIFIER_MASK.LEFT_GUI, HID_KEY_CODES.D)}>
        <Text style={styles.quickActionText}>Desktop</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionKey}
        onPress={() => onSendCombo(0, HID_KEY_CODES.PRINT_SCREEN)}>
        <Text style={styles.quickActionText}>PrtScn</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionKey}
        onPress={() => onSendCombo(0, HID_KEY_CODES.MUTE)}>
        <Text style={styles.quickActionText}>Mute</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionKey}
        onPress={() => onSendCombo(0, HID_KEY_CODES.VOLUME_DOWN)}>
        <Text style={styles.quickActionText}>Vol -</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionKey}
        onPress={() => onSendCombo(0, HID_KEY_CODES.VOLUME_UP)}>
        <Text style={styles.quickActionText}>Vol +</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

