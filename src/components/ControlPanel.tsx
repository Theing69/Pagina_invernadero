// src/components/ControlPanel.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { OperationMode, ThemeColors, WingId, WingState } from '../types/iot.types';

interface ControlPanelProps {
  operationMode: OperationMode;
  wings: Record<WingId, WingState>;
  colors: ThemeColors;
  onChangeMode: (mode: OperationMode) => void;
  onToggleValve: (wingId: WingId) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  operationMode,
  wings,
  colors,
  onChangeMode,
  onToggleValve,
}) => {
  const isManual = operationMode === 'MANUAL';

  const renderWingCard = (wing: WingState) => {
    const statusColor = wing.valveOpen ? colors.success : colors.textSecondary;

    return (
      <View
        key={wing.id}
        style={[
          styles.wingCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.wingHeader}>
          <View style={styles.wingTitleRow}>
            <MaterialCommunityIcons
              name="sprinkler-variant"
              size={22}
              color={wing.valveOpen ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.wingTitle, { color: colors.textPrimary }]}>{wing.name}</Text>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: wing.valveOpen ? `${colors.success}20` : colors.surfaceElevated,
              },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
            <Text style={[styles.badgeText, { color: statusColor }]}>
              {wing.valveOpen ? 'VÁLVULA ON' : 'VÁLVULA OFF'}
            </Text>
          </View>
        </View>

        {/* Métricas locales del Ala */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricBox, { backgroundColor: colors.surfaceElevated }]}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Humedad Suelo
            </Text>
            <Text style={[styles.metricValue, { color: colors.primary }]}>
              {wing.soilMoisture.toFixed(1)}%
            </Text>
          </View>

          <View style={[styles.metricBox, { backgroundColor: colors.surfaceElevated }]}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Temperatura
            </Text>
            <Text style={[styles.metricValue, { color: colors.chartTemp }]}>
              {wing.temperature.toFixed(1)}°C
            </Text>
          </View>
        </View>

        {/* Información de Umbrales y Conmutador */}
        <View style={styles.controlFooter}>
          <View>
            <Text style={[styles.thresholdText, { color: colors.textSecondary }]}>
              Umbral Auto: {wing.minMoistureThreshold}% – {wing.maxMoistureThreshold}%
            </Text>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              {isManual
                ? 'Control manual habilitado'
                : 'Gobernado por ESP32 (Edge PID/Histéresis)'}
            </Text>
          </View>

          <Switch
            value={wing.valveOpen}
            disabled={!isManual}
            onValueChange={() => onToggleValve(wing.id)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={wing.valveOpen ? '#FFFFFF' : '#CBD5E1'}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Selector Global de Modo: Automático vs Manual */}
      <View
        style={[
          styles.modeCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.modeHeader}>
          <MaterialCommunityIcons name="cpu-64-bit" size={22} color={colors.primary} />
          <View style={styles.modeTextContainer}>
            <Text style={[styles.modeTitle, { color: colors.textPrimary }]}>
              Lógica de Riego del Invernadero
            </Text>
            <Text style={[styles.modeSubtitle, { color: colors.textSecondary }]}>
              {operationMode === 'AUTO'
                ? 'Modo Automático: El ESP32 acciona electroválvulas según sensores'
                : 'Modo Manual: Conmutación directa por el operador desde la App'}
            </Text>
          </View>
        </View>

        <View style={[styles.segmentedControl, { backgroundColor: colors.surfaceElevated }]}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              operationMode === 'AUTO' && { backgroundColor: colors.primary },
            ]}
            onPress={() => onChangeMode('AUTO')}
          >
            <MaterialCommunityIcons
              name="robot-outline"
              size={16}
              color={operationMode === 'AUTO' ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.segmentText,
                { color: operationMode === 'AUTO' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Automático
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              operationMode === 'MANUAL' && { backgroundColor: colors.warning },
            ]}
            onPress={() => onChangeMode('MANUAL')}
          >
            <MaterialCommunityIcons
              name="hand-back-right-outline"
              size={16}
              color={operationMode === 'MANUAL' ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.segmentText,
                { color: operationMode === 'MANUAL' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Manual
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tarjetas de Control por Ala */}
      {renderWingCard(wings.left)}
      {renderWingCard(wings.right)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  modeCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modeSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
  },
  wingCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  wingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  wingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wingTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  metricBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  controlFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  thresholdText: {
    fontSize: 12,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 11,
    marginTop: 2,
  },
});