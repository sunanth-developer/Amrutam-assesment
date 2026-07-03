import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@/design-system/theme/ThemeProvider';
import { ToastProvider } from '@/design-system/components/Toast';
import { ErrorBoundary } from '@/core/errors/ErrorBoundary';
import { AppNavigator } from '@/navigation/AppNavigator';
import { useI18nStore } from '@/localization/i18n';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useConsultationStore } from '@/modules/consultation/store/consultationStore';
import { useShopStore } from '@/modules/shop/store/shopStore';
import { startBackgroundSync } from '@/core/sync/backgroundSync';

function AppContent() {
  const { isDark } = useTheme();
  const loadLocale = useI18nStore((s) => s.loadLocale);
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const user = useAuthStore((s) => s.user);
  const loadBookings = useConsultationStore((s) => s.loadBookings);
  const loadPersisted = useShopStore((s) => s.loadPersisted);
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    (async () => {
      await hydrateAuth();
      await loadLocale();
      setReady(true);
    })();
    return startBackgroundSync();
  }, [hydrateAuth, loadLocale]);

  useEffect(() => {
    if (user) {
      loadBookings();
      loadPersisted();
    }
  }, [user, loadBookings, loadPersisted]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
