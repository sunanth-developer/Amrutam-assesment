import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ThemeColors } from '../design-system/theme/colors';
import { radii } from '../design-system/theme/colors';
import type { ViewStyle } from 'react-native';

export const TAB_BAR_WIDTH_RATIO = 0.8;

export function getStackScreenOptions(colors: ThemeColors): NativeStackNavigationOptions {
  return {
    headerLargeTitle: false,
    headerShadowVisible: false,
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.primary,
    headerTitleStyle: { fontWeight: '700', fontSize: 17, color: colors.text },
    contentStyle: { backgroundColor: colors.background },
  };
}

export function getTabBarShellStyle(colors: ThemeColors, isDark: boolean): ViewStyle {
  return {
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.tabBar,
    borderTopWidth: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: isDark ? 0.35 : 0.1,
    shadowRadius: 16,
    elevation: 10,
  };
}
