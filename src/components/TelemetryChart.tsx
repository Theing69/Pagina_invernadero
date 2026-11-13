// src/components/TelemetryChart.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { TelemetryHistoryPoint, ThemeColors } from '../types/iot.types';

interface TelemetryChartProps {
  history: TelemetryHistoryPoint[];
  colors: ThemeColors;
}

type ChartMetric = 'MOISTURE' | 'TEMPERATURE';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const TelemetryChart: React.FC<TelemetryChartProps> = ({ history, colors }) => {
  const [selectedMetric, setSelectedMetric] = useState<ChartMetric>('MOISTURE');

  const labels = history.map((pt) => pt.timestamp);

  const chartData =
    selectedMetric === 'MOISTURE'
      ? {
          labels,
          datasets: [
            {
              data: history.map((pt) => pt.leftMoisture),
              color: () => colors.chartMoistureLeft,
              strokeWidth: 2.5,
            },
            {
              data: history.map((pt) => pt.rightMoisture),
              color: () => colors.chartMoistureRight,
              strokeWidth: 2.5,
            },
          ],
          legend: ['Humedad Ala Izq (%)', 'Humedad Ala Der (%)'],
        }
      : {
          labels,
          datasets: [
            {
              data: history.map((pt) => pt.ambientTemp),
              color: () => colors.chartTemp,
              strokeWidth: 2.5,
            },
          ],
          legend: ['Temperatura Ambiental (°C)'],
        };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Tendencia Histórica en Tiempo Real
        </Text>
        <View style={[styles.tabContainer, { backgroundColor: colors.surfaceElevated }]}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedMetric === 'MOISTURE' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setSelectedMetric('MOISTURE')}
          >
            <Text
              style={[
                styles.tabText,
                { color: selectedMetric === 'MOISTURE' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Humedad
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedMetric === 'TEMPERATURE' && { backgroundColor: colors.chartTemp },
            ]}
            onPress={() => setSelectedMetric('TEMPERATURE')}
          >
            <Text
              style={[
                styles.tabText,
                { color: selectedMetric === 'TEMPERATURE' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Temp.
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <LineChart
        data={chartData}
        width={SCREEN_WIDTH - 64}
        height={210}
        yAxisSuffix={selectedMetric === 'MOISTURE' ? '%' : '°C'}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 1,
          color: () => colors.primary,
          labelColor: () => colors.textSecondary,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: colors.surface,
          },
          propsForBackgroundLines: {
            stroke: colors.border,
            strokeDasharray: '4',
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chart: {
    marginVertical: 4,
    borderRadius: 12,
  },
});