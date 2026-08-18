import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { DiceCountSelector } from '../components/DiceCountSelector';
import { DiceRow } from '../components/DiceRow';
import { RollButton } from '../components/RollButton';
import { RollHistoryList } from '../components/RollHistoryList';
import { useDiceRoller } from '../hooks/useDiceRoller';
import { useShakeGesture } from '../hooks/useShakeGesture';

export function DiceScreen() {
  const [diceCount, setDiceCount] = useState(2);
  const { results, rolling, roll, history, total } = useDiceRoller(diceCount);

  useShakeGesture(roll, !rolling);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Rolling Dice</Text>
        <DiceCountSelector value={diceCount} onChange={setDiceCount} disabled={rolling} />
      </View>

      <View style={styles.diceArea}>
        <DiceRow results={results} rolling={rolling} />
        <Text style={styles.total}>{total}</Text>
        <RollButton onPress={roll} disabled={rolling} />
      </View>

      <RollHistoryList data={history} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    color: '#f0e9d6',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  diceArea: {
    alignItems: 'center',
    gap: 18,
    paddingVertical: 24,
  },
  total: {
    color: '#c9a227',
    fontSize: 40,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});
