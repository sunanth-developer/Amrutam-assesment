import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightColors } from '@/design-system/theme/colors';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={[styles.container, { backgroundColor: lightColors.background }]} accessibilityRole="alert">
          <Ionicons name="alert-circle" size={40} color={lightColors.error} />
          <Text style={[styles.title, { color: lightColors.text }]}>Something went wrong</Text>
          <Text style={[styles.message, { color: lightColors.textSecondary }]}>
            {this.state.error?.message ?? 'Unknown error'}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  message: { fontSize: 15, textAlign: 'center' },
});
