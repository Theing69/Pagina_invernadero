// src/store/useGreenhouseStore.ts
import { create } from 'zustand';
import { OperationMode, TelemetryHistoryPoint, ThemeMode, WingId, WingState } from '../types/iot.types';

interface GreenhouseState {
  theme: ThemeMode;
  isConnected: boolean;
  operationMode: OperationMode;
  ambientTemp: number;
  wings: Record<WingId, WingState>;
  history: TelemetryHistoryPoint[];

  // Acciones
  toggleTheme: () => void;
  setOperationMode: (mode: OperationMode) => void;
  toggleWingValve: (wingId: WingId) => void;
  updateWingThresholds: (wingId: WingId, min: number, max: number) => void;
  ingestTelemetry: (payload: {
    ambientTemp: number;
    leftMoisture: number;
    rightMoisture: number;
    leftTemp: number;
    rightTemp: number;
  }) => void;
}

const INITIAL_HISTORY: TelemetryHistoryPoint[] = [
  { timestamp: '12:00', ambientTemp: 24.5, leftMoisture: 45, rightMoisture: 52 },
  { timestamp: '12:05', ambientTemp: 25.1, leftMoisture: 44, rightMoisture: 50 },
  { timestamp: '12:10', ambientTemp: 25.8, leftMoisture: 42, rightMoisture: 49 },
  { timestamp: '12:15', ambientTemp: 26.2, leftMoisture: 41, rightMoisture: 48 },
  { timestamp: '12:20', ambientTemp: 26.0, leftMoisture: 46, rightMoisture: 47 },
  { timestamp: '12:25', ambientTemp: 25.6, leftMoisture: 51, rightMoisture: 46 },
];

export const useGreenhouseStore = create<GreenhouseState>((set) => ({
  theme: 'dark',
  isConnected: true,
  operationMode: 'AUTO',
  ambientTemp: 25.6,
  wings: {
    left: {
      id: 'left',
      name: 'Ala Izquierda',
      soilMoisture: 51.0,
      temperature: 25.4,
      valveOpen: false,
      minMoistureThreshold: 40,
      maxMoistureThreshold: 70,
    },
    right: {
      id: 'right',
      name: 'Ala Derecha',
      soilMoisture: 46.0,
      temperature: 25.8,
      valveOpen: false,
      minMoistureThreshold: 40,
      maxMoistureThreshold: 70,
    },
  },
  history: INITIAL_HISTORY,

  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  setOperationMode: (mode) =>
    set(() => ({
      operationMode: mode,
      // Aquí se publicaría por MQTT al tópico: itsn/greenhouse/control/mode
    })),

  toggleWingValve: (wingId) =>
    set((state) => {
      // Bloqueo de seguridad: solo permite conmutación directa en modo MANUAL
      if (state.operationMode !== 'MANUAL') return state;

      const currentWing = state.wings[wingId];
      const nextValveState = !currentWing.valveOpen;

      // Aquí se publicaría por MQTT al tópico: itsn/greenhouse/wings/${wingId}/valve
      return {
        wings: {
          ...state.wings,
          [wingId]: {
            ...currentWing,
            valveOpen: nextValveState,
          },
        },
      };
    }),

  updateWingThresholds: (wingId, min, max) =>
    set((state) => ({
      wings: {
        ...state.wings,
        [wingId]: {
          ...state.wings[wingId],
          minMoistureThreshold: min,
          maxMoistureThreshold: max,
        },
      },
    })),

  ingestTelemetry: ({ ambientTemp, leftMoisture, rightMoisture, leftTemp, rightTemp }) =>
    set((state) => {
      const now = new Date();
      const timeLabel = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      const evaluateAutoValve = (wing: WingState, currentMoisture: number): boolean => {
        if (state.operationMode === 'MANUAL') return wing.valveOpen;
        if (currentMoisture < wing.minMoistureThreshold) return true;  // Disparo por sequedad
        if (currentMoisture >= wing.maxMoistureThreshold) return false; // Corte por saturación
        return wing.valveOpen; // Histéresis entre ambos umbrales
      };

      const nextLeftValve = evaluateAutoValve(state.wings.left, leftMoisture);
      const nextRightValve = evaluateAutoValve(state.wings.right, rightMoisture);

      const nextHistory = [
        ...state.history.slice(-5), // Mantiene ventana móvil de 6 lecturas para legibilidad
        {
          timestamp: timeLabel,
          ambientTemp,
          leftMoisture,
          rightMoisture,
        },
      ];

      return {
        ambientTemp,
        history: nextHistory,
        wings: {
          left: {
            ...state.wings.left,
            soilMoisture: leftMoisture,
            temperature: leftTemp,
            valveOpen: nextLeftValve,
          },
          right: {
            ...state.wings.right,
            soilMoisture: rightMoisture,
            temperature: rightTemp,
            valveOpen: nextRightValve,
          },
        },
      };
    }),
}));