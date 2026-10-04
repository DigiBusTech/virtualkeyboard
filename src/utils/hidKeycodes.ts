/**
 * USB HID Usage Tables - Keyboard/Keypad Page (0x07)
 * Standard scan codes for USB HID keyboards.
 */

export interface KeyDefinition {
  label: string;
  shiftLabel?: string;
  code: number;
  width?: number; // relative width flex multiplier
  isModifier?: boolean;
  modifierBit?: number;
}

export const MODIFIER_MASK = {
  NONE: 0x00,
  LEFT_CTRL: 0x01,
  LEFT_SHIFT: 0x02,
  LEFT_ALT: 0x04,
  LEFT_GUI: 0x08, // Windows / Command
  RIGHT_CTRL: 0x10,
  RIGHT_SHIFT: 0x20,
  RIGHT_ALT: 0x40, // AltGr / Option
  RIGHT_GUI: 0x80,
} as const;

export const HID_KEY_CODES = {
  // Letters
  A: 0x04,
  B: 0x05,
  C: 0x06,
  D: 0x07,
  E: 0x08,
  F: 0x09,
  G: 0x0A,
  H: 0x0B,
  I: 0x0C,
  J: 0x0D,
  K: 0x0E,
  L: 0x0F,
  M: 0x10,
  N: 0x11,
  O: 0x12,
  P: 0x13,
  Q: 0x14,
  R: 0x15,
  S: 0x16,
  T: 0x17,
  U: 0x18,
  V: 0x19,
  W: 0x1A,
  X: 0x1B,
  Y: 0x1C,
  Z: 0x1D,

  // Numbers (Top Row)
  NUM_1: 0x1E,
  NUM_2: 0x1F,
  NUM_3: 0x20,
  NUM_4: 0x21,
  NUM_5: 0x22,
  NUM_6: 0x23,
  NUM_7: 0x24,
  NUM_8: 0x25,
  NUM_9: 0x26,
  NUM_0: 0x27,

  // Control / Function
  ENTER: 0x28,
  ESCAPE: 0x29,
  BACKSPACE: 0x2A,
  TAB: 0x2B,
  SPACE: 0x2C,
  MINUS: 0x2D,
  EQUAL: 0x2E,
  LEFT_BRACKET: 0x2F,
  RIGHT_BRACKET: 0x30,
  BACKSLASH: 0x31,
  SEMICOLON: 0x33,
  QUOTE: 0x34,
  GRAVE: 0x35,
  COMMA: 0x36,
  PERIOD: 0x37,
  SLASH: 0x38,
  CAPS_LOCK: 0x39,

  // Navigation
  RIGHT_ARROW: 0x4F,
  LEFT_ARROW: 0x50,
  DOWN_ARROW: 0x51,
  UP_ARROW: 0x52,
  DELETE: 0x4C,
} as const;

export const KEYBOARD_LAYOUT: KeyDefinition[][] = [
  // Number row
  [
    { label: '`', shiftLabel: '~', code: HID_KEY_CODES.GRAVE },
    { label: '1', shiftLabel: '!', code: HID_KEY_CODES.NUM_1 },
    { label: '2', shiftLabel: '@', code: HID_KEY_CODES.NUM_2 },
    { label: '3', shiftLabel: '#', code: HID_KEY_CODES.NUM_3 },
    { label: '4', shiftLabel: '$', code: HID_KEY_CODES.NUM_4 },
    { label: '5', shiftLabel: '%', code: HID_KEY_CODES.NUM_5 },
    { label: '6', shiftLabel: '^', code: HID_KEY_CODES.NUM_6 },
    { label: '7', shiftLabel: '&', code: HID_KEY_CODES.NUM_7 },
    { label: '8', shiftLabel: '*', code: HID_KEY_CODES.NUM_8 },
    { label: '9', shiftLabel: '(', code: HID_KEY_CODES.NUM_9 },
    { label: '0', shiftLabel: ')', code: HID_KEY_CODES.NUM_0 },
    { label: '-', shiftLabel: '_', code: HID_KEY_CODES.MINUS },
    { label: '=', shiftLabel: '+', code: HID_KEY_CODES.EQUAL },
    { label: '⌫', code: HID_KEY_CODES.BACKSPACE, width: 1.5 },
  ],
  // QWERTY row
  [
    { label: 'Tab', code: HID_KEY_CODES.TAB, width: 1.3 },
    { label: 'Q', code: HID_KEY_CODES.Q },
    { label: 'W', code: HID_KEY_CODES.W },
    { label: 'E', code: HID_KEY_CODES.E },
    { label: 'R', code: HID_KEY_CODES.R },
    { label: 'T', code: HID_KEY_CODES.T },
    { label: 'Y', code: HID_KEY_CODES.Y },
    { label: 'U', code: HID_KEY_CODES.U },
    { label: 'I', code: HID_KEY_CODES.I },
    { label: 'O', code: HID_KEY_CODES.O },
    { label: 'P', code: HID_KEY_CODES.P },
    { label: '[', shiftLabel: '{', code: HID_KEY_CODES.LEFT_BRACKET },
    { label: ']', shiftLabel: '}', code: HID_KEY_CODES.RIGHT_BRACKET },
    { label: '\\', shiftLabel: '|', code: HID_KEY_CODES.BACKSLASH },
  ],
  // ASDF row
  [
    { label: 'Esc', code: HID_KEY_CODES.ESCAPE, width: 1.2 },
    { label: 'A', code: HID_KEY_CODES.A },
    { label: 'S', code: HID_KEY_CODES.S },
    { label: 'D', code: HID_KEY_CODES.D },
    { label: 'F', code: HID_KEY_CODES.F },
    { label: 'G', code: HID_KEY_CODES.G },
    { label: 'H', code: HID_KEY_CODES.H },
    { label: 'J', code: HID_KEY_CODES.J },
    { label: 'K', code: HID_KEY_CODES.K },
    { label: 'L', code: HID_KEY_CODES.L },
    { label: ';', shiftLabel: ':', code: HID_KEY_CODES.SEMICOLON },
    { label: "'", shiftLabel: '"', code: HID_KEY_CODES.QUOTE },
    { label: 'Enter', code: HID_KEY_CODES.ENTER, width: 1.8 },
  ],
  // ZXCV row
  [
    {
      label: '⇧ Shift',
      code: 0,
      isModifier: true,
      modifierBit: MODIFIER_MASK.LEFT_SHIFT,
      width: 1.7,
    },
    { label: 'Z', code: HID_KEY_CODES.Z },
    { label: 'X', code: HID_KEY_CODES.X },
    { label: 'C', code: HID_KEY_CODES.C },
    { label: 'V', code: HID_KEY_CODES.V },
    { label: 'B', code: HID_KEY_CODES.B },
    { label: 'N', code: HID_KEY_CODES.N },
    { label: 'M', code: HID_KEY_CODES.M },
    { label: ',', shiftLabel: '<', code: HID_KEY_CODES.COMMA },
    { label: '.', shiftLabel: '>', code: HID_KEY_CODES.PERIOD },
    { label: '/', shiftLabel: '?', code: HID_KEY_CODES.SLASH },
    { label: '↑', code: HID_KEY_CODES.UP_ARROW },
    { label: 'Del', code: HID_KEY_CODES.DELETE, width: 1.2 },
  ],
  // Bottom modifier / Space row
  [
    {
      label: 'Ctrl',
      code: 0,
      isModifier: true,
      modifierBit: MODIFIER_MASK.LEFT_CTRL,
      width: 1.2,
    },
    {
      label: 'Alt',
      code: 0,
      isModifier: true,
      modifierBit: MODIFIER_MASK.LEFT_ALT,
      width: 1.2,
    },
    {
      label: '⊞ Win/Cmd',
      code: 0,
      isModifier: true,
      modifierBit: MODIFIER_MASK.LEFT_GUI,
      width: 1.5,
    },
    { label: 'Space', code: HID_KEY_CODES.SPACE, width: 4.5 },
    { label: '←', code: HID_KEY_CODES.LEFT_ARROW },
    { label: '↓', code: HID_KEY_CODES.DOWN_ARROW },
    { label: '→', code: HID_KEY_CODES.RIGHT_ARROW },
  ],
];
