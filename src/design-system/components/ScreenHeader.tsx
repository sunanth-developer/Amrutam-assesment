import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenHeader({ title, subtitle, right, style }: ScreenHeaderProps) {
  const { colors, typography, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.sm, paddingHorizontal: spacing.md }, style]}>
      <View style={styles.textBlock}>
        <Text style={[typography.display, { color: colors.text, fontSize: 30 }]}>{title}</Text>
        {subtitle ? (
          <Text style={[typography.body, { color: colors.textSecondary, marginTop: 4 }]}>{subtitle}</Text>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  textBlock: { flex: 1 },
  right: { marginLeft: 12, marginBottom: 4 },
});
