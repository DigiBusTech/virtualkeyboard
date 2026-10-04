import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { HID_CONSUMER_CODES, HID_KEY_CODES, MODIFIER_MASK } from '../utils/hidKeycodes';
import { styles } from './VirtualKeyboard.styles';

interface QuickActionBarProps {
  onSendCombo(modBit: number, code: number): void;
  onSendConsumer?(code: number): void;
}

export function QuickActionBar({ onSendCombo, onSendConsumer }: QuickActionBarProps) {
  const { theme } = useTheme();

  const handleConsumerPress = (code: number) => {
    if (onSendConsumer) {
      onSendConsumer(code);
    }
  };

  const pillStyle = [
    styles.macroPill,
    { backgroundColor: theme.bgCardElevated, borderColor: theme.borderSubtle },
  ];
  const pillTextStyle = [styles.macroPillText, { color: theme.textSecondary }];

  return (
    <View style={styles.macroRibbonWrapper}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.macroRibbonContent}>
        <TouchableOpacity
          style={pillStyle}
          onPress={() => onSendCombo(MODIFIER_MASK.LEFT_CTRL, HID_KEY_CODES.C)}
          activeOpacity={0.7}>
          <Text style={pillTextStyle}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={pillStyle}
          onPress={() => onSendCombo(MODIFIER_MASK.LEFT_CTRL, HID_KEY_CODES.V)}
          activeOpacity={0.7}>
          <Text style={pillTextStyle}>Paste</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={pillStyle}
          onPress={() => onSendCombo(MODIFIER_MASK.LEFT_CTRL, HID_KEY_CODES.A)}
          activeOpacity={0.7}>
          <Text style={pillTextStyle}>Select All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={pillStyle}
          onPress={() => onSendCombo(MODIFIER_MASK.LEFT_CTRL, HID_KEY_CODES.Z)}
          activeOpacity={0.7}>
          <Text style={pillTextStyle}>Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={pillStyle}
          onPress={() => onSendCombo(MODIFIER_MASK.LEFT_ALT, HID_KEY_CODES.TAB)}
          activeOpacity={0.7}>
          <Text style={pillTextStyle}>Alt+Tab</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={pillStyle}
          onPress={() => onSendCombo(MODIFIER_MASK.LEFT_GUI, HID_KEY_CODES.D)}
          activeOpacity={0.7}>
          <Text style={pillTextStyle}>Desktop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={pillStyle}
          onPress={() => onSendCombo(0, HID_KEY_CODES.PRINT_SCREEN)}
          activeOpacity={0.7}>
          <Text style={pillTextStyle}>PrtScn</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={pillStyle}
          onPress={() => handleConsumerPress(HID_CONSUMER_CODES.MUTE)}
          activeOpacity={0.7}>
          <Text style={pillTextStyle}>Mute 🔇</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={pillStyle}
          onPress={() => handleConsumerPress(HID_CONSUMER_CODES.VOLUME_DECREMENT)}
          activeOpacity={0.7}>
          <Text style={pillTextStyle}>Vol - 🔉</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={pillStyle}
          onPress={() => handleConsumerPress(HID_CONSUMER_CODES.VOLUME_INCREMENT)}
          activeOpacity={0.7}>
          <Text style={pillTextStyle}>Vol + 🔊</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={pillStyle}
          onPress={() => handleConsumerPress(HID_CONSUMER_CODES.BRIGHTNESS_DECREMENT)}
          activeOpacity={0.7}>
          <Text style={pillTextStyle}>Bri - 🔅</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={pillStyle}
          onPress={() => handleConsumerPress(HID_CONSUMER_CODES.BRIGHTNESS_INCREMENT)}
          activeOpacity={0.7}>
          <Text style={pillTextStyle}>Bri + 🔆</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}



