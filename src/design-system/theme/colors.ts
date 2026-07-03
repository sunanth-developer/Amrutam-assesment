export const lightColors = {
  primary: '#1A7A55',
  primaryLight: '#2ECC8A',
  primaryDark: '#0F4D35',
  secondary: '#C8956C',
  secondaryLight: '#F5E6D8',
  accent: '#7C5CBF',
  background: '#F4F7F5',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#0F1A14',
  textSecondary: '#5C6B63',
  textMuted: '#8A9690',
  border: '#E2EAE5',
  borderLight: '#EEF3F0',
  error: '#E5484D',
  success: '#30A46C',
  warning: '#F5A524',
  info: '#3B9EFF',
  card: '#FFFFFF',
  tabBar: '#FFFFFF',
  overlay: 'rgba(15, 26, 20, 0.45)',
  onPrimary: '#FFFFFF',
  gradientStart: '#0D3D2B',
  gradientMid: '#1A7A55',
  gradientEnd: '#2ECC8A',
};

export const darkColors = {
  primary: '#3DD68C',
  primaryLight: '#5EEAD4',
  primaryDark: '#1A7A55',
  secondary: '#E9B88A',
  secondaryLight: '#3D3028',
  accent: '#A78BFA',
  background: '#0C1210',
  surface: '#161F1B',
  surfaceElevated: '#1E2A24',
  text: '#F0F5F2',
  textSecondary: '#9BAAA3',
  textMuted: '#6B7A73',
  border: '#2A3832',
  borderLight: '#1E2A24',
  error: '#FF6B6B',
  success: '#4ADE80',
  warning: '#FBBF24',
  info: '#60A5FA',
  card: '#1A2420',
  tabBar: '#161F1B',
  overlay: 'rgba(0, 0, 0, 0.6)',
  onPrimary: '#0C1210',
  gradientStart: '#071A12',
  gradientMid: '#0F4D35',
  gradientEnd: '#1A7A55',
};

export type ThemeColors = typeof lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#0F1A14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F1A14',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#0F1A14',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 12,
  },
} as const;

export const typography = {
  display: { fontSize: 34, fontWeight: '800' as const, letterSpacing: -0.8 },
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.2 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  caption: { fontSize: 13, fontWeight: '500' as const, letterSpacing: 0.1 },
  overline: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.2, textTransform: 'uppercase' as const },
  button: { fontSize: 16, fontWeight: '700' as const, letterSpacing: 0.2 },
};
