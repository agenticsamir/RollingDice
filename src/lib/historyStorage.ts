import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HistoryEntry } from '../types/dice';

const STORAGE_KEY = 'rolling-dice/history';
const MAX_ENTRIES = 50;

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveHistory(history: HistoryEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_ENTRIES)));
  } catch {
    // best-effort persistence; a failed write shouldn't break the app
  }
}
