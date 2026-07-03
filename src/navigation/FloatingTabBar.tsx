import React from 'react';
import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTheme } from '../design-system/theme/ThemeProvider';
import { getTabBarShellStyle, TAB_BAR_WIDTH_RATIO } from './screenOptions';

export function FloatingTabBar(props: BottomTabBarProps) {
  const { colors, isDark } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const tabBarWidth = screenWidth * TAB_BAR_WIDTH_RATIO;

  return (
    <View style={styles.host} pointerEvents="box-none">
      <View style={[getTabBarShellStyle(colors, isDark), { width: tabBarWidth }]}>
        <BottomTabBar
          {...props}
          style={{
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            height: 52,
            paddingBottom: 4,
            paddingTop: 4,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
