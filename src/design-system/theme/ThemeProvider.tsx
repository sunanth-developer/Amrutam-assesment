import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, radii, shadows, spacing, typography, type ThemeColors } from './colors';
import { getItem, setItem, STORAGE_KEYS } from '../../core/storage/storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  spacing: typeof spacing;
  typography: typeof typography;
  radii: typeof radii;
  shadows: typeof shadows;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    getItem<ThemeMode>(STORAGE_KEYS.THEME).then((saved) => {
      if (saved) setModeState(saved);
    });
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    setItem(STORAGE_KEYS.THEME, newMode);
  };

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const value = useMemo(
    () => ({ colors, isDark, mode, setMode, spacing, typography, radii, shadows }),
    [colors, isDark, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
