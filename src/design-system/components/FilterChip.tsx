import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  const { colors, spacing, typography, radii } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Filter: ${label}`}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.borderLight,
          borderRadius: radii.full,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          marginRight: spacing.sm,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text
        style={[
          typography.caption,
          { color: selected ? colors.onPrimary : colors.text, fontWeight: selected ? '700' : '500' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { borderWidth: 1, marginBottom: 8 },
});
