import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/design-system/components/Button';
import { TextField } from '@/design-system/components/TextField';
import { useToast } from '@/design-system/components/Toast';
import { useTheme } from '@/design-system/theme/ThemeProvider';
import { DEMO_ACCOUNT } from '@/modules/auth/config/demoAccount';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { getErrorMessage } from '@/core/errors/AppError';

export function LoginScreen() {
  const { colors, typography, radii, shadows, spacing } = useTheme();
  const { showToast } = useToast();
  const login = useAuthStore((s) => s.login);
  const loginWithDemo = useAuthStore((s) => s.loginWithDemo);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Enter email and password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      showToast(`Welcome, ${DEMO_ACCOUNT.user.name}`, 'success');
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    setError('');
    setLoading(true);
    try {
      await loginWithDemo();
      showToast('Signed in', 'success');
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]} style={styles.gradient}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.hero}>
              <Ionicons name="leaf" size={48} color="#fff" />
              <Text style={[typography.h1, styles.brand]}>Amrutam</Text>
              <Text style={styles.tagline}>Consult · Shop · Health records</Text>
            </View>

            <View style={[styles.card, shadows.lg, { backgroundColor: colors.surface, borderRadius: radii.lg }]}>
              <Text style={[typography.h2, { color: colors.text }]}>Sign in</Text>

              <TextField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={styles.field}
              />
              <TextField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                containerStyle={styles.field}
                error={error}
              />

              {loading ? (
                <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
              ) : (
                <>
                  <Button title="Sign in" onPress={handleLogin} style={{ marginTop: spacing.sm }} />
                  <Button title="Use demo account" variant="outline" onPress={handleDemoLogin} style={{ marginTop: spacing.sm }} />
                </>
              )}

              <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.md, textAlign: 'center' }]}>
                Demo: {DEMO_ACCOUNT.email} / {DEMO_ACCOUNT.password}
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: 32 },
  brand: { color: '#fff', marginTop: 12 },
  tagline: { color: 'rgba(255,255,255,0.8)', marginTop: 6, fontSize: 15 },
  card: { padding: 20 },
  field: { marginBottom: 12 },
});
