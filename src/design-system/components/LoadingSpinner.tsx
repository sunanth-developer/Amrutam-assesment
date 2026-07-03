import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={message}>
      <View style={[styles.ring, { borderColor: colors.primary + '25' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
      <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.md }]}>{message}</Text>
    </View>
  );
}

export function EmptyState({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: keyof typeof Ionicons.glyphMap }) {
  const { colors, spacing, typography, radii } = useTheme();
  return (
    <View style={styles.container} accessibilityRole="text">
      <View style={[styles.iconCircle, { backgroundColor: colors.primary + '12', borderRadius: radii.full }]}>
        <Ionicons name={icon ?? 'leaf-outline'} size={32} color={colors.primary} />
      </View>
      <Text style={[typography.h3, { color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs }]}>{title}</Text>
      {subtitle && (
        <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', maxWidth: 280 }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  ring: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
