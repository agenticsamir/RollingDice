import { StatusBar } from 'expo-status-bar';
import { DiceScreen } from './src/screens/DiceScreen';

export default function App() {
  return (
    <>
      <DiceScreen />
      <StatusBar style="light" />
    </>
  );
}
