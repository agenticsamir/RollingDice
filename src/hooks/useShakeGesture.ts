import { useEffect, useRef } from 'react';
import { Accelerometer, type AccelerometerMeasurement } from 'expo-sensors';

const UPDATE_INTERVAL_MS = 100;
const SHAKE_THRESHOLD = 1.7; // delta g-force magnitude between consecutive samples
const COOLDOWN_MS = 1200;

/** Fires `onShake` when the device is shaken, debounced so a single shake can't double-trigger. */
export function useShakeGesture(onShake: () => void, enabled: boolean) {
  const lastReading = useRef<AccelerometerMeasurement | null>(null);
  const lastShakeAt = useRef(0);
  const onShakeRef = useRef(onShake);
  onShakeRef.current = onShake;

  useEffect(() => {
    if (!enabled) return;

    Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);
    const subscription = Accelerometer.addListener((measurement) => {
      const prev = lastReading.current;
      lastReading.current = measurement;
      if (!prev) return;

      const delta = Math.sqrt(
        (measurement.x - prev.x) ** 2 +
          (measurement.y - prev.y) ** 2 +
          (measurement.z - prev.z) ** 2
      );

      const now = Date.now();
      if (delta > SHAKE_THRESHOLD && now - lastShakeAt.current > COOLDOWN_MS) {
        lastShakeAt.current = now;
        onShakeRef.current();
      }
    });

    return () => subscription.remove();
  }, [enabled]);
}
