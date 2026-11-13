// src/hooks/useTelemetrySimulator.ts
import { useEffect } from 'react';
import { useGreenhouseStore } from '../store/useGreenhouseStore';

export const useTelemetrySimulator = (enabled: boolean = true) => {
  const ingestTelemetry = useGreenhouseStore((state) => state.ingestTelemetry);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      const state = useGreenhouseStore.getState();
      const { left, right } = state.wings;

      // Simulación de deriva térmica suave
      const deltaTemp = (Math.random() - 0.48) * 0.6;
      const nextAmbientTemp = Math.min(38, Math.max(16, state.ambientTemp + deltaTemp));

      // Simulación física de humedad del suelo según estado de cada electroválvula
      const calcNextMoisture = (current: number, isValveOpen: boolean) => {
        const delta = isValveOpen
          ? 2.5 + Math.random() * 1.5   // Sube rápido cuando riega
          : -(1.0 + Math.random() * 1.2); // Baja por evapotranspiración
        return Math.min(95, Math.max(15, Number((current + delta).toFixed(1))));
      };

      ingestTelemetry({
        ambientTemp: Number(nextAmbientTemp.toFixed(1)),
        leftMoisture: calcNextMoisture(left.soilMoisture, left.valveOpen),
        rightMoisture: calcNextMoisture(right.soilMoisture, right.valveOpen),
        leftTemp: Number((nextAmbientTemp - 0.3 + Math.random() * 0.4).toFixed(1)),
        rightTemp: Number((nextAmbientTemp + 0.2 + Math.random() * 0.4).toFixed(1)),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [enabled, ingestTelemetry]);
};