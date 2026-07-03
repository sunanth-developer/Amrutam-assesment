import React from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search...', ...rest }: SearchBarProps) {
  const { colors, typography, radii, shadows } = useTheme();

  return (
    <View
      style={[
        styles.container,
        shadows.sm,
        {
          backgroundColor: colors.surface,
          borderColor: colors.borderLight,
          borderRadius: radii.lg,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.primary + '12' }]}>
        <Ionicons name="search" size={18} color={colors.primary} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[typography.body, styles.input, { color: colors.text }]}
        accessibilityRole="search"
        accessibilityLabel={placeholder}
        clearButtonMode="while-editing"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginBottom: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  input: { flex: 1, paddingVertical: 10 },
});
