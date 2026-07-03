import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({ children, style, elevated = true, padding = 'md' }: CardProps) {
  const { colors, radii, shadows, spacing } = useTheme();

  const paddingMap = {
    none: 0,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: radii.lg,
          borderColor: colors.borderLight,
          padding: paddingMap[padding],
        },
        elevated ? shadows.sm : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, overflow: 'hidden' },
});
