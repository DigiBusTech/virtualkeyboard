import React, { createContext, useContext, useMemo, useState } from 'react';
import { DARK_THEME, LIGHT_THEME, ThemeColors } from '../theme/theme';

interface ThemeContextType {
  isDark: boolean;
  theme: ThemeColors;
  toggleTheme: () => void;
  setDarkMode: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  theme: DARK_THEME,
  toggleTheme: () => {},
  setDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(true);

  const toggleTheme = () => setIsDark(prev => !prev);
  const setDarkMode = (dark: boolean) => setIsDark(dark);

  const theme = useMemo(() => (isDark ? DARK_THEME : LIGHT_THEME), [isDark]);

  const value = useMemo(
    () => ({
      isDark,
      theme,
      toggleTheme,
      setDarkMode,
    }),
    [isDark, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
