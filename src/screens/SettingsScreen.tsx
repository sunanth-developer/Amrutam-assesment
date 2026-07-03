import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../design-system/components/Button';
import { Card } from '../design-system/components/Card';
import { Badge } from '../design-system/components/Badge';
import { ScreenHeader } from '../design-system/components/ScreenHeader';
import { useTheme } from '../design-system/theme/ThemeProvider';
import { useTranslation } from '../localization/i18n';
import { useNetworkStatus } from '../core/network/networkMonitor';
import { useAuthStore } from '../modules/auth/store/authStore';
import { useToast } from '../design-system/components/Toast';

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors, typography, spacing } = useTheme();
  return (
    <View style={{ marginTop: spacing.lg }}>
      <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.sm, fontWeight: '600' }]}>
        {title.toUpperCase()}
      </Text>
      <Card padding="md">{children}</Card>
    </View>
  );
}

export function SettingsScreen() {
  const { colors, spacing, typography, isDark, setMode } = useTheme();
  const { locale, setLocale, t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isOnline = useNetworkStatus();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { showToast } = useToast();

  const handleLogout = async () => {
    await logout();
    showToast(t('signedOut'), 'info');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.lg }}
        showsVerticalScrollIndicator
      >
        <ScreenHeader title={t('profile')} />

        {user && (
          <Card style={{ marginTop: spacing.md }}>
            <View style={styles.profileRow}>
              <View style={[styles.avatar, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="person" size={28} color={colors.primary} />
              </View>
              <View>
                <Text style={[typography.h3, { color: colors.text }]}>{user.name}</Text>
                <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>{user.email}</Text>
              </View>
            </View>
          </Card>
        )}

        <SettingsSection title={t('appearance')}>
          <Button
            title={isDark ? t('lightMode') : t('darkMode')}
            variant="secondary"
            onPress={() => setMode(isDark ? 'light' : 'dark')}
          />
        </SettingsSection>

        <SettingsSection title={t('language')}>
          <View style={styles.row}>
            <Button title="English" variant={locale === 'en' ? 'primary' : 'outline'} onPress={() => setLocale('en')} style={styles.langBtn} size="sm" />
            <Button title="हिंदी" variant={locale === 'hi' ? 'primary' : 'outline'} onPress={() => setLocale('hi')} style={styles.langBtn} size="sm" />
          </View>
        </SettingsSection>

        <SettingsSection title={t('status')}>
          <View style={styles.rowBetween}>
            <Text style={[typography.bodyMedium, { color: colors.text }]}>{t('network')}</Text>
            <Badge label={isOnline ? t('online') : t('offline')} variant={isOnline ? 'success' : 'error'} />
          </View>
        </SettingsSection>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.borderLight,
            paddingBottom: insets.bottom + 72,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
          },
        ]}
      >
        <Button title={t('signOut')} variant="danger" onPress={handleLogout} size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  footer: { borderTopWidth: 1 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', gap: 10 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  langBtn: { flex: 1 },
});
