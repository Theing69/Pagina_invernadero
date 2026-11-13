// src/theme/palette.ts
import { ThemeColors, ThemeMode } from '../types/iot.types';

export const PALETTES: Record<ThemeMode, ThemeColors> = {
  dark: {
    background: '#0B132B',
    surface: '#1C2541',
    surfaceElevated: '#273459',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
    primary: '#38BDF8',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    chartTemp: '#F97316',
    chartMoistureLeft: '#38BDF8',
    chartMoistureRight: '#10B981',
  },
  light: {
    background: '#F1F5F9',
    surface: '#FFFFFF',
    surfaceElevated: '#F8FAFC',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    primary: '#0284C7',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    chartTemp: '#EA580C',
    chartMoistureLeft: '#0284C7',
    chartMoistureRight: '#059669',
  },
};