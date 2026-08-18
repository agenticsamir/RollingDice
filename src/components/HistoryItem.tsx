import { StyleSheet, Text, View } from 'react-native';
import type { HistoryEntry } from '../types/dice';

interface HistoryItemProps {
  entry: HistoryEntry;
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function HistoryItem({ entry }: HistoryItemProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.values}>{entry.values.join(' + ')}</Text>
      <Text style={styles.total}>{entry.total}</Text>
      <Text style={styles.time}>{formatTime(entry.timestamp)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#22223a',
  },
  values: {
    flex: 1,
    color: '#9aa0b5',
    fontSize: 13,
  },
  total: {
    color: '#f0e9d6',
    fontSize: 15,
    fontWeight: '700',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'right',
  },
  time: {
    color: '#5b6272',
    fontSize: 11,
    width: 56,
    textAlign: 'right',
  },
});
