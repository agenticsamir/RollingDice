import type { DieValue } from '../types/dice';

/** Percentage offsets (0-100) within the die face for each pip, by face value. */
export const PIP_LAYOUTS: Record<DieValue, [number, number][]> = {
  1: [[50, 50]],
  2: [[26, 26], [74, 74]],
  3: [[26, 26], [50, 50], [74, 74]],
  4: [[26, 26], [74, 26], [26, 74], [74, 74]],
  5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]],
  6: [[26, 22], [74, 22], [26, 50], [74, 50], [26, 78], [74, 78]],
};

export const ROLL_DURATION_MS = 900;
export const ROLL_STAGGER_MS = 45;
