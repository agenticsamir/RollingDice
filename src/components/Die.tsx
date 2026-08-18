import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { PIP_LAYOUTS, ROLL_DURATION_MS, ROLL_STAGGER_MS } from '../lib/diceGeometry';
import type { DieValue } from '../types/dice';

interface DieProps {
  value: DieValue;
  rolling: boolean;
  index: number;
  size?: number;
}

const randomTurns = (min: number, max: number) =>
  Math.floor(min + Math.random() * (max - min + 1));

export function Die({ value, rolling, index, size = 72 }: DieProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const rotateZ = useSharedValue(0);
  const translateY = useSharedValue(0);
  const shadowScale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.35);
  const wasRolling = useRef(false);

  useEffect(() => {
    if (rolling && !wasRolling.current) {
      const delay = index * ROLL_STAGGER_MS;
      const spinDuration = ROLL_DURATION_MS;
      const turnsX = randomTurns(2, 4);
      const turnsY = randomTurns(1, 3);
      const turnsZ = randomTurns(2, 4);

      const settle = () => setDisplayValue(value);

      rotateX.value = withDelay(
        delay,
        withTiming(360 * turnsX, { duration: spinDuration, easing: Easing.out(Easing.cubic) })
      );
      rotateY.value = withDelay(
        delay,
        withTiming(360 * turnsY, {
          duration: spinDuration * 0.9,
          easing: Easing.out(Easing.cubic),
        })
      );
      rotateZ.value = withDelay(
        delay,
        withTiming(
          360 * turnsZ,
          { duration: spinDuration * 1.05, easing: Easing.out(Easing.cubic) },
          (finished) => {
            if (finished) {
              runOnJS(settle)();
              rotateX.value = 0;
              rotateY.value = 0;
              rotateZ.value = 0;
            }
          }
        )
      );

      translateY.value = withDelay(
        delay,
        withSequence(
          withTiming(-size * 0.32, { duration: 150, easing: Easing.out(Easing.quad) }),
          withTiming(-size * 0.06, { duration: 140 }),
          withTiming(-size * 0.2, { duration: 130 }),
          withSpring(0, { damping: 7, stiffness: 140 })
        )
      );
      shadowScale.value = withDelay(
        delay,
        withSequence(
          withTiming(0.55, { duration: 150 }),
          withTiming(0.85, { duration: 140 }),
          withTiming(0.65, { duration: 130 }),
          withSpring(1, { damping: 7, stiffness: 140 })
        )
      );
      shadowOpacity.value = withDelay(
        delay,
        withSequence(withTiming(0.15, { duration: 150 }), withTiming(0.35, { duration: 420 }))
      );
    }
    wasRolling.current = rolling;
  }, [rolling]);

  const dieStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { translateY: translateY.value },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
      { rotateZ: `${rotateZ.value}deg` },
    ],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: shadowOpacity.value,
    transform: [{ scaleX: shadowScale.value }],
  }));

  return (
    <View style={[styles.wrapper, { width: size, height: size * 1.35 }]}>
      <Animated.View
        style={[styles.shadow, shadowStyle, { width: size * 0.82, bottom: size * 0.02 }]}
      />
      <Animated.View style={[styles.face, dieStyle, { width: size, height: size }]}>
        <LinearGradient
          colors={['#fbf7ee', '#e4dcc4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: size * 0.2 }]}
        >
          <View style={[styles.bevel, { borderRadius: size * 0.14, margin: size * 0.05 }]} />
          {PIP_LAYOUTS[displayValue].map(([px, py], i) => (
            <View
              key={i}
              style={[
                styles.pip,
                {
                  width: size * 0.16,
                  height: size * 0.16,
                  borderRadius: size * 0.08,
                  left: (size * px) / 100 - (size * 0.16) / 2,
                  top: (size * py) / 100 - (size * 0.16) / 2,
                },
              ]}
            >
              <View
                style={[
                  styles.pipHighlight,
                  { width: size * 0.05, height: size * 0.05, borderRadius: size * 0.025 },
                ]}
              />
            </View>
          ))}
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  shadow: {
    position: 'absolute',
    height: 12,
    borderRadius: 999,
    backgroundColor: '#000000',
  },
  face: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  gradient: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  bevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  pip: {
    position: 'absolute',
    backgroundColor: '#a3791c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipHighlight: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    marginBottom: '35%',
    marginRight: '25%',
  },
});
