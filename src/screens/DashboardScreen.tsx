// src/screens/DashboardScreen.tsx
import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGreenhouseStore } from '../store/useGreenhouseStore';
import { PALETTES } from '../theme/palette';
import { TelemetryChart } from '../components/TelemetryChart';
import { ControlPanel } from '../components/ControlPanel';
import { useTelemetrySimulator } from '../hooks/useTelemetrySimulator';

export const DashboardScreen: React.FC = () => {
  const {
    theme,
    isConnected,
    operationMode,
    ambientTemp,
    wings,
    history,
    toggleTheme,
    setOperationMode,
    toggleWingValve,
  } = useGreenhouseStore();

  // Activa la simulación de telemetría en tiempo real (o suscripción MQTT)
  useTelemetrySimulator(true);

  const colors = PALETTES[theme];
  const avgSoilMoisture =
    (wings.left.soilMoisture + wings.right.soilMoisture) / 2;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Encabezado Superior y Botón Dark/Light Mode */}
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
              {isConnected ? 'ESP32 Online • MQTT Activo' : 'Sin conexión'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.themeToggleBtn,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={toggleTheme}
        >
          <MaterialCommunityIcons
            name={theme === 'dark' ? 'weather-sunny' : 'weather-night'}
            size={22}
            color={theme === 'dark' ? colors.warning : colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Resumen Rápido de KPIs Globales */}
      <View style={styles.kpiRow}>
        <View
          style={[
            styles.kpiCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <MaterialCommunityIcons name="thermometer" size={24} color={colors.chartTemp} />
          <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>
            Temp. Ambiental
          </Text>
          <Text style={[styles.kpiValue, { color: colors.textPrimary }]}>
            {ambientTemp.toFixed(1)} °C
          </Text>
        </View>

        <View
          style={[
            styles.kpiCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <MaterialCommunityIcons name="water-percent" size={24} color={colors.primary} />
          <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>
            Humedad Promedio
          </Text>
          <Text style={[styles.kpiValue, { color: colors.textPrimary }]}>
            {avgSoilMoisture.toFixed(1)} %
          </Text>
        </View>
      </View>

      {/* Gráfica en Tiempo Real */}
      <TelemetryChart history={history} colors={colors} />

      {/* Panel de Control Independiente por Ala y Selector de Modo */}
      <ControlPanel
        operationMode={operationMode}
        wings={wings}
        colors={colors}
        onChangeMode={setOperationMode}
        onToggleValve={toggleWingValve}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
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
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  kpiLabel: {
    fontSize: 12,
    marginTop: 6,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
});