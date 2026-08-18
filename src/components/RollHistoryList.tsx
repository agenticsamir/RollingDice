import { FlatList, StyleSheet, Text, View } from 'react-native';
import { HistoryItem } from './HistoryItem';
import type { HistoryEntry } from '../types/dice';

interface RollHistoryListProps {
  data: HistoryEntry[];
}

export function RollHistoryList({ data }: RollHistoryListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>History</Text>
      {data.length === 0 ? (
        <Text style={styles.empty}>Your rolls will show up here.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryItem entry={item} />}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  heading: {
    color: '#5b6272',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  empty: {
    color: '#5b6272',
    fontSize: 13,
  },
  list: {
    flex: 1,
  },
});
