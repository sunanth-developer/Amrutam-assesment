import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const { colors, spacing, typography, radii } = useTheme();

  const sizeStyles = {
    sm: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md },
    md: { paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.lg },
    lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  };

  const variantStyles: Record<string, { bg: string; text: string; border?: string }> = {
    primary: { bg: colors.primary, text: colors.onPrimary },
    secondary: { bg: colors.secondaryLight, text: colors.primaryDark },
    outline: { bg: 'transparent', text: colors.primary, border: colors.primary },
    danger: { bg: colors.error, text: '#FFF' },
    ghost: { bg: 'transparent', text: colors.text },
  };

  const v = variantStyles[variant];
  const isGradient = variant === 'primary' && !disabled;

  const content = (
    <Text style={[typography.button, { color: v.text, textAlign: 'center', fontSize: size === 'sm' ? 14 : 16 }]}>
      {title}
    </Text>
  );

  if (isGradient) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ disabled }}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }, style]}
      >
        <LinearGradient
          colors={[colors.gradientMid, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, sizeStyles[size], { borderRadius: radii.md }]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        sizeStyles[size],
        {
          backgroundColor: v.bg,
          borderColor: v.border ?? 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderRadius: radii.md,
          opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
        },
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', justifyContent: 'center' },
});
