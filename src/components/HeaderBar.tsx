// src/components/HeaderBar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeColors, ThemeMode } from '../types/iot.types';

export interface HeaderBarProps {
  theme: ThemeMode;
  isConnected: boolean;
  colors: ThemeColors;
  onToggleTheme: () => void;
}

export const HeaderBar = ({
  theme,
  isConnected,
  colors,
  onToggleTheme,
}: HeaderBarProps) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={[styles.appTitle, { color: colors.textPrimary }]}>
          Invernadero ITSN
        </Text>
        <View style={styles.connectionRow}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: isConnected ? colors.success : colors.danger },
            ]}
          />
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isConnected ? 'ESP32 Online - MQTT Activo' : 'Sin conexion'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.themeToggleBtn,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={onToggleTheme}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={theme === 'dark' ? 'weather-sunny' : 'weather-night'}
          size={22}
          color={theme === 'dark' ? colors.warning : colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  themeToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});