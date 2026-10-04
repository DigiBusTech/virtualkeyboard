export interface ThemeColors {
  bgDark: string;
  bgCard: string;
  bgCardElevated: string;
  bgSurface: string;
  bgInput: string;
  bgKey: string;
  bgKeyAccent: string;
  keyBorder: string;
  accentBlue: string;
  accentCyan: string;
  accentIndigo: string;
  accentPurple: string;
  accentEmerald: string;
  accentAmber: string;
  accentRose: string;
  borderSubtle: string;
  borderMedium: string;
  borderActive: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textHighlight: string;
  errorBg: string;
  errorText: string;
  glassBg: string;
  glassBorder: string;
}

export const DARK_THEME: ThemeColors = {
  bgDark: '#0F1014',
  bgCard: '#1A1C23',
  bgCardElevated: '#21242E',
  bgSurface: '#1E212B',
  bgInput: '#14161C',
  bgKey: '#272A35',
  bgKeyAccent: 'rgba(59, 130, 246, 0.15)',
  keyBorder: 'rgba(255, 255, 255, 0.06)',
  accentBlue: '#3B82F6',
  accentCyan: '#38BDF8',
  accentIndigo: '#6366F1',
  accentPurple: '#A855F7',
  accentEmerald: '#10B981',
  accentAmber: '#F59E0B',
  accentRose: '#EF4444',
  borderSubtle: 'rgba(255, 255, 255, 0.06)',
  borderMedium: 'rgba(59, 130, 246, 0.3)',
  borderActive: '#3B82F6',
  textPrimary: '#F8FAFC',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textHighlight: '#3B82F6',
  errorBg: '#3F1D1D',
  errorText: '#EF4444',
  glassBg: 'rgba(26, 28, 35, 0.92)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
};

export const LIGHT_THEME: ThemeColors = {
  bgDark: '#F1F5F9',
  bgCard: '#FFFFFF',
  bgCardElevated: '#F8FAFC',
  bgSurface: '#E2E8F0',
  bgInput: '#EDF2F7',
  bgKey: '#FFFFFF',
  bgKeyAccent: 'rgba(37, 99, 235, 0.12)',
  keyBorder: 'rgba(0, 0, 0, 0.08)',
  accentBlue: '#2563EB',
  accentCyan: '#0284C7',
  accentIndigo: '#4F46E5',
  accentPurple: '#9333EA',
  accentEmerald: '#059669',
  accentAmber: '#D97706',
  accentRose: '#DC2626',
  borderSubtle: 'rgba(0, 0, 0, 0.08)',
  borderMedium: 'rgba(37, 99, 235, 0.3)',
  borderActive: '#2563EB',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textHighlight: '#2563EB',
  errorBg: '#FEE2E2',
  errorText: '#DC2626',
  glassBg: 'rgba(255, 255, 255, 0.95)',
  glassBorder: 'rgba(0, 0, 0, 0.08)',
};

export const BRANDING = {
  name: 'Digi VirtualKeyboard',
  company: 'DigiBusTech',
  website: 'https://digibustech.com/',
  tagline: 'Smart Bluetooth HID & IoT Innovations',
  version: '1.0.0',
} as const;

export const THEME = {
  colors: DARK_THEME,
  branding: BRANDING,
} as const;


