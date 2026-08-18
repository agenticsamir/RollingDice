import { StyleSheet, View } from 'react-native';
import { Die } from './Die';
import type { DieValue } from '../types/dice';

interface DiceRowProps {
  results: DieValue[];
  rolling: boolean;
}

export function DiceRow({ results, rolling }: DiceRowProps) {
  const size = results.length > 4 ? 56 : 72;

  return (
    <View style={styles.row}>
      {results.map((value, i) => (
        <Die key={i} value={value} rolling={rolling} index={i} size={size} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 12,
    minHeight: 110,
  },
});
