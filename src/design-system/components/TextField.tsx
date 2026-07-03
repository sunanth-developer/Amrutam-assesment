import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

interface TextFieldProps extends TextInputProps {
  label: string;
  containerStyle?: ViewStyle;
  error?: string;
}

export function TextField({ label, containerStyle, error, style, ...rest }: TextFieldProps) {
  const { colors, typography, radii, shadows } = useTheme();
  const [focused, setFocused] = React.useState(false);
  const [hidden, setHidden] = React.useState(rest.secureTextEntry ?? false);

  return (
    <View style={containerStyle}>
      <Text style={[typography.caption, styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          shadows.sm,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : focused ? colors.primary : colors.borderLight,
            borderRadius: radii.md,
          },
        ]}
      >
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[typography.body, styles.input, { color: colors.text }, style]}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          secureTextEntry={hidden}
          {...rest}
        />
        {rest.secureTextEntry && (
          <Pressable onPress={() => setHidden((v) => !v)} hitSlop={8} accessibilityLabel="Toggle password visibility">
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      {error ? <Text style={[typography.caption, { color: colors.error, marginTop: 6 }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 8, fontWeight: '600' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 16,
    minHeight: 54,
  },
  input: { flex: 1, paddingVertical: 14 },
});
