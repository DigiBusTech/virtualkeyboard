import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { HID_KEY_CODES, MODIFIER_MASK } from '../utils/hidKeycodes';
import { styles } from './VirtualKeyboard.styles';

interface QuickActionBarProps {
  onSendCombo: (modBit: number, code: number) => void;
}

export function QuickActionBar({ onSendCombo }: QuickActionBarProps) {
  return (
    <View style={styles.macroRibbonWrapper}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.macroRibbonContent}>
        <TouchableOpacity
          style={styles.macroPill}
          onPress={() => onSendCombo(MODIFIER_MASK.LEFT_CTRL, HID_KEY_CODES.C)}
          activeOpacity={0.7}>
          <Text style={styles.macroPillText}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.macroPill}
          onPress={() => onSendCombo(MODIFIER_MASK.LEFT_CTRL, HID_KEY_CODES.V)}
          activeOpacity={0.7}>
          <Text style={styles.macroPillText}>Paste</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.macroPill}
          onPress={() => onSendCombo(MODIFIER_MASK.LEFT_CTRL, HID_KEY_CODES.A)}
          activeOpacity={0.7}>
          <Text style={styles.macroPillText}>Select All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.macroPill}
          onPress={() => onSendCombo(MODIFIER_MASK.LEFT_CTRL, HID_KEY_CODES.Z)}
          activeOpacity={0.7}>
          <Text style={styles.macroPillText}>Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.macroPill}
          onPress={() => onSendCombo(MODIFIER_MASK.LEFT_ALT, HID_KEY_CODES.TAB)}
          activeOpacity={0.7}>
          <Text style={styles.macroPillText}>Alt+Tab</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.macroPill}
          onPress={() => onSendCombo(MODIFIER_MASK.LEFT_GUI, HID_KEY_CODES.D)}
          activeOpacity={0.7}>
          <Text style={styles.macroPillText}>Desktop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.macroPill}
          onPress={() => onSendCombo(0, HID_KEY_CODES.PRINT_SCREEN)}
          activeOpacity={0.7}>
          <Text style={styles.macroPillText}>PrtScn</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.macroPill}
          onPress={() => onSendCombo(0, HID_KEY_CODES.MUTE)}
          activeOpacity={0.7}>
          <Text style={styles.macroPillText}>Mute</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.macroPill}
          onPress={() => onSendCombo(0, HID_KEY_CODES.VOLUME_DOWN)}
          activeOpacity={0.7}>
          <Text style={styles.macroPillText}>Vol -</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.macroPill}
          onPress={() => onSendCombo(0, HID_KEY_CODES.VOLUME_UP)}
          activeOpacity={0.7}>
          <Text style={styles.macroPillText}>Vol +</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


