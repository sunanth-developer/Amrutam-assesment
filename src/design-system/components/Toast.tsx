import React, { createContext, useCallback, useContext, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastIcons: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { colors, spacing, typography, radii, shadows } = useTheme();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const accentColors = { success: colors.success, error: colors.error, info: colors.primary };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.container} pointerEvents="none">
        {toasts.map((toast) => (
          <Animated.View
            key={toast.id}
            style={[
              styles.toast,
              shadows.md,
              {
                backgroundColor: colors.surfaceElevated,
                borderLeftColor: accentColors[toast.type],
                borderRadius: radii.md,
                marginBottom: spacing.sm,
                padding: spacing.md,
              },
            ]}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <Ionicons name={toastIcons[toast.type]} size={22} color={accentColors[toast.type]} style={styles.icon} />
            <Text style={[typography.bodyMedium, { color: colors.text, flex: 1 }]}>{toast.message}</Text>
          </Animated.View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 88,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  icon: { marginRight: 12 },
});
