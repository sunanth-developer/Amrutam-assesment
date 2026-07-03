import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type BadgeVariant = 'primary' | 'success' | 'error' | 'warning' | 'neutral';

interface BadgeProps {
  label: string | number;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'primary', style }: BadgeProps) {
  const { colors, typography, radii } = useTheme();

  const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
    primary: { bg: colors.primary + '18', text: colors.primary },
    success: { bg: colors.success + '18', text: colors.success },
    error: { bg: colors.error + '18', text: colors.error },
    warning: { bg: colors.warning + '22', text: colors.warning },
    neutral: { bg: colors.borderLight, text: colors.textSecondary },
  };

  const v = variantColors[variant];

  return (
    <View style={[styles.badge, { backgroundColor: v.bg, borderRadius: radii.full }, style]}>
      <Text style={[typography.caption, { color: v.text, fontWeight: '700' }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
});
