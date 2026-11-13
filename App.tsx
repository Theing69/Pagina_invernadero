// App.tsx
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useGreenhouseStore } from './src/store/useGreenhouseStore';
import { PALETTES } from './src/theme/palette';
import { DashboardScreen } from './src/screens/DashboardScreen';

export default function App() {
  const theme = useGreenhouseStore((state) => state.theme);
  const colors = PALETTES[theme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <DashboardScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});