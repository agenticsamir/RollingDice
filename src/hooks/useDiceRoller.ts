import { useCallback, useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { rollDice } from '../lib/random';
import { loadHistory, saveHistory } from '../lib/historyStorage';
import { ROLL_DURATION_MS, ROLL_STAGGER_MS } from '../lib/diceGeometry';
import { useSound } from './useSound';
import type { DieValue, HistoryEntry } from '../types/dice';

export function useDiceRoller(diceCount: number) {
  const [results, setResults] = useState<DieValue[]>(() => rollDice(diceCount));
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const { play } = useSound();

  useEffect(() => {
    loadHistory().then(setHistory);
  }, []);

  useEffect(() => {
    if (!rolling) {
      setResults((prev) =>
        prev.length === diceCount ? prev : rollDice(diceCount)
      );
    }
  }, [diceCount, rolling]);

  const settleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const roll = useCallback(() => {
    if (rolling) return;

    setRolling(true);
    play();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const values = rollDice(diceCount);
    setResults(values);

    const totalDuration = ROLL_DURATION_MS + diceCount * ROLL_STAGGER_MS;
    settleTimeout.current = setTimeout(() => {
      setRolling(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
        values,
        total: values.reduce((sum, v) => sum + v, 0),
      };
      setHistory((prev) => {
        const next = [entry, ...prev];
        saveHistory(next);
        return next;
      });
    }, totalDuration);
  }, [diceCount, rolling, play]);

  useEffect(() => {
    return () => {
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
    };
  }, []);

  const total = results.reduce((sum, v) => sum + v, 0);

  return { results, rolling, roll, history, total };
}
