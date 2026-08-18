import { useCallback } from 'react';
import { useAudioPlayer } from 'expo-audio';

const diceRollSound = require('../../assets/sounds/dice-roll.mp3');

export function useSound() {
  const player = useAudioPlayer(diceRollSound);

  const play = useCallback(() => {
    player.seekTo(0).finally(() => player.play());
  }, [player]);

  return { play };
}
