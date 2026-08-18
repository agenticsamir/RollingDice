export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

export interface HistoryEntry {
  id: string;
  timestamp: number;
  values: DieValue[];
  total: number;
}
