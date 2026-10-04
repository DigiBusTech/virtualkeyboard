/**
 * USB HID Usage Tables - Keyboard/Keypad Page (0x07)
 * Complete desktop & laptop scan codes.
 */

export interface KeyDefinition {
  label: string;
  shiftLabel?: string;
  code: number;
  width?: number;
  isModifier?: boolean;
  modifierBit?: number;
  isSpecial?: boolean;
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

  // Function Keys F1 - F12
  F1: 0x3A,
  F2: 0x3B,
  F3: 0x3C,
  F4: 0x3D,
  F5: 0x3E,
  F6: 0x3F,
  F7: 0x40,
  F8: 0x41,
  F9: 0x42,
  F10: 0x43,
  F11: 0x44,
  F12: 0x45,

  // System & Navigation
  PRINT_SCREEN: 0x46,
  SCROLL_LOCK: 0x47,
  PAUSE_BREAK: 0x48,
  INSERT: 0x49,
  HOME: 0x4A,
  PAGE_UP: 0x4B,
  DELETE: 0x4C,
  END: 0x4D,
  PAGE_DOWN: 0x4E,

  // Navigation Arrows
  RIGHT_ARROW: 0x4F,
  LEFT_ARROW: 0x50,
  DOWN_ARROW: 0x51,
  UP_ARROW: 0x52,

  // Media / Audio Controls
  MUTE: 0x7F,
  VOLUME_UP: 0x80,
  VOLUME_DOWN: 0x81,

  // Numpad Keys
  KEYPAD_NUM_LOCK: 0x53,
  KEYPAD_SLASH: 0x54,
  KEYPAD_ASTERISK: 0x55,
  KEYPAD_MINUS: 0x56,
  KEYPAD_PLUS: 0x57,
  KEYPAD_ENTER: 0x58,
  KEYPAD_1: 0x59,
  KEYPAD_2: 0x5A,
  KEYPAD_3: 0x5B,
  KEYPAD_4: 0x5C,
  KEYPAD_5: 0x5D,
  KEYPAD_6: 0x5E,
  KEYPAD_7: 0x5F,
  KEYPAD_8: 0x60,
  KEYPAD_9: 0x61,
  KEYPAD_0: 0x62,
  KEYPAD_PERIOD: 0x63,
} as const;


export const QWERTY_LAYOUT: KeyDefinition[][] = [
  // Numbers row
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
    { label: 'Bksp', code: HID_KEY_CODES.BACKSPACE, width: 1.4, isSpecial: true },
  ],
  // QWERTY row
  [
    { label: 'Tab', code: HID_KEY_CODES.TAB, width: 1.2, isSpecial: true },
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
  // Home row (ASDF)
  [
    { label: 'Esc', code: HID_KEY_CODES.ESCAPE, width: 1.2, isSpecial: true },
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
    { label: 'Enter', code: HID_KEY_CODES.ENTER, width: 1.8, isSpecial: true },
  ],
  // Bottom row (ZXCV)
  [
    {
      label: 'Shift',
      code: 0,
      isModifier: true,
      modifierBit: MODIFIER_MASK.LEFT_SHIFT,
      width: 1.5,
      isSpecial: true,
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
    { label: '▲', code: HID_KEY_CODES.UP_ARROW, isSpecial: true },
    { label: 'Del', code: HID_KEY_CODES.DELETE, width: 1.1, isSpecial: true },
  ],
  // Modifier / Space row
  [
    {
      label: 'Ctrl',
      code: 0,
      isModifier: true,
      modifierBit: MODIFIER_MASK.LEFT_CTRL,
      width: 1.2,
      isSpecial: true,
    },
    {
      label: 'Alt',
      code: 0,
      isModifier: true,
      modifierBit: MODIFIER_MASK.LEFT_ALT,
      width: 1.2,
      isSpecial: true,
    },
    {
      label: 'Win',
      code: 0,
      isModifier: true,
      modifierBit: MODIFIER_MASK.LEFT_GUI,
      width: 1.2,
      isSpecial: true,
    },
    { label: 'Space', code: HID_KEY_CODES.SPACE, width: 4.5 },
    { label: '◄', code: HID_KEY_CODES.LEFT_ARROW, isSpecial: true },
    { label: '▼', code: HID_KEY_CODES.DOWN_ARROW, isSpecial: true },
    { label: '►', code: HID_KEY_CODES.RIGHT_ARROW, isSpecial: true },
  ],
];


// Function Keys & Media / Hardware Controls Layout
export const FUNCTION_MEDIA_LAYOUT: KeyDefinition[][] = [
  // Media / System quick bar
  [
    { label: 'PrtScn', code: HID_KEY_CODES.PRINT_SCREEN, width: 1.5, isSpecial: true },
    { label: 'Mute', code: HID_KEY_CODES.MUTE, width: 1.3, isSpecial: true },
    { label: 'Vol -', code: HID_KEY_CODES.VOLUME_DOWN, width: 1.3, isSpecial: true },
    { label: 'Vol +', code: HID_KEY_CODES.VOLUME_UP, width: 1.3, isSpecial: true },
    { label: 'Ins', code: HID_KEY_CODES.INSERT, isSpecial: true },
    { label: 'Home', code: HID_KEY_CODES.HOME, isSpecial: true },
    { label: 'End', code: HID_KEY_CODES.END, isSpecial: true },
  ],
  // Function keys F1 - F6
  [
    { label: 'F1 Bright-', code: HID_KEY_CODES.F1 },
    { label: 'F2 Bright+', code: HID_KEY_CODES.F2 },
    { label: 'F3 Task', code: HID_KEY_CODES.F3 },
    { label: 'F4 App', code: HID_KEY_CODES.F4 },
    { label: 'F5 Reload', code: HID_KEY_CODES.F5 },
    { label: 'F6 Search', code: HID_KEY_CODES.F6 },
  ],
  // Function keys F7 - F12
  [
    { label: 'F7 Prev', code: HID_KEY_CODES.F7 },
    { label: 'F8 Play', code: HID_KEY_CODES.F8 },
    { label: 'F9 Next', code: HID_KEY_CODES.F9 },
    { label: 'F10 Mute', code: HID_KEY_CODES.F10 },
    { label: 'F11 Full', code: HID_KEY_CODES.F11 },
    { label: 'F12 Menu', code: HID_KEY_CODES.F12 },
  ],
  // Navigation & Page controls
  [
    { label: 'PgUp', code: HID_KEY_CODES.PAGE_UP, width: 1.5, isSpecial: true },
    { label: 'PgDn', code: HID_KEY_CODES.PAGE_DOWN, width: 1.5, isSpecial: true },
    { label: 'ScrLk', code: HID_KEY_CODES.SCROLL_LOCK, width: 1.3, isSpecial: true },
    { label: 'Pause', code: HID_KEY_CODES.PAUSE_BREAK, width: 1.3, isSpecial: true },
    { label: 'Del', code: HID_KEY_CODES.DELETE, width: 1.5, isSpecial: true },
  ],
];

// Numeric Keypad (Numpad) Layout
export const NUMPAD_LAYOUT: KeyDefinition[][] = [
  [
    { label: 'NumLk', code: HID_KEY_CODES.KEYPAD_NUM_LOCK, isSpecial: true },
    { label: '/', code: HID_KEY_CODES.KEYPAD_SLASH, isSpecial: true },
    { label: '*', code: HID_KEY_CODES.KEYPAD_ASTERISK, isSpecial: true },
    { label: '-', code: HID_KEY_CODES.KEYPAD_MINUS, isSpecial: true },
  ],
  [
    { label: '7', code: HID_KEY_CODES.KEYPAD_7 },
    { label: '8', code: HID_KEY_CODES.KEYPAD_8 },
    { label: '9', code: HID_KEY_CODES.KEYPAD_9 },
    { label: '+', code: HID_KEY_CODES.KEYPAD_PLUS, isSpecial: true },
  ],
  [
    { label: '4', code: HID_KEY_CODES.KEYPAD_4 },
    { label: '5', code: HID_KEY_CODES.KEYPAD_5 },
    { label: '6', code: HID_KEY_CODES.KEYPAD_6 },
    { label: 'Bksp', code: HID_KEY_CODES.BACKSPACE, isSpecial: true },
  ],
  [
    { label: '1', code: HID_KEY_CODES.KEYPAD_1 },
    { label: '2', code: HID_KEY_CODES.KEYPAD_2 },
    { label: '3', code: HID_KEY_CODES.KEYPAD_3 },
    { label: 'Enter', code: HID_KEY_CODES.KEYPAD_ENTER, width: 1.5, isSpecial: true },
  ],
  [
    { label: '0', code: HID_KEY_CODES.KEYPAD_0, width: 2 },
    { label: '.', code: HID_KEY_CODES.KEYPAD_PERIOD },
    { label: 'Esc', code: HID_KEY_CODES.ESCAPE, isSpecial: true },
  ],
];

export const KEYBOARD_LAYOUT = QWERTY_LAYOUT;
