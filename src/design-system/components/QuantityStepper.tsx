import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  compact?: boolean;
}

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  disabled = false,
  compact = false,
}: QuantityStepperProps) {
  const { colors, typography, radii } = useTheme();

  const btnSize = compact ? 28 : 34;

  return (
    <View
      style={[
        styles.stepper,
        {
          borderColor: colors.primary + '40',
          backgroundColor: colors.primary + '0D',
          borderRadius: radii.sm,
        },
      ]}
      accessibilityRole="adjustable"
      accessibilityLabel={`Quantity ${quantity}`}
    >
      <Pressable
        onPress={onDecrement}
        style={[styles.btn, { width: btnSize, height: btnSize, backgroundColor: colors.primary, borderRadius: radii.xs }]}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <Text style={styles.btnText}>−</Text>
      </Pressable>
      <Text style={[typography.bodyMedium, styles.count, { color: colors.text }]}>{quantity}</Text>
      <Pressable
        onPress={onIncrement}
        disabled={disabled}
        style={[
          styles.btn,
          {
            width: btnSize,
            height: btnSize,
            backgroundColor: disabled ? colors.border : colors.primary,
            borderRadius: radii.xs,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <Text style={styles.btnText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  btn: { alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: '700', lineHeight: 20 },
  count: { minWidth: 28, textAlign: 'center', fontWeight: '700' },
});
