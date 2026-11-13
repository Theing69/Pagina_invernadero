// src/types/iot.types.ts
export type WingId = 'left' | 'right';
export type OperationMode = 'AUTO' | 'MANUAL';
export type ThemeMode = 'dark' | 'light';

export interface WingState {
  id: WingId;
  name: string;
  soilMoisture: number;       // Humedad actual del sustrato (%)
  temperature: number;        // Temperatura local del ala (°C)
  valveOpen: boolean;         // Estado de la electroválvula (true = ON, false = OFF)
  minMoistureThreshold: number; // Setpoint mínimo para disparo en modo AUTO (%)
  maxMoistureThreshold: number; // Setpoint máximo para corte en modo AUTO (%)
}

export interface TelemetryHistoryPoint {
  timestamp: string;
  ambientTemp: number;
  leftMoisture: number;
  rightMoisture: number;
}

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
  chartTemp: string;
  chartMoistureLeft: string;
  chartMoistureRight: string;
}