import { Pressable, StyleSheet, Text, View } from 'react-native';

interface DiceCountSelectorProps {
  value: number;
  onChange: (count: number) => void;
  disabled?: boolean;
}

const COUNTS = [1, 2, 3, 4, 5, 6];

export function DiceCountSelector({ value, onChange, disabled }: DiceCountSelectorProps) {
  return (
    <View style={styles.container}>
      {COUNTS.map((count) => {
        const active = count === value;
        return (
          <Pressable
            key={count}
            onPress={() => onChange(count)}
            disabled={disabled}
            style={[styles.item, active && styles.itemActive]}
            hitSlop={4}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{count}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#22223a',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  item: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemActive: {
    backgroundColor: '#c9a227',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9aa0b5',
  },
  labelActive: {
    color: '#1a1a2e',
  },
});
