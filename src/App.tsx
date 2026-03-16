import { useState, useRef } from 'react';
import LandingScreen from './screens/LandingScreen';
import GameScreen, { type GameResult } from './screens/GameScreen';
import EndScreen from './screens/EndScreen';

type Screen = 'landing' | 'game' | 'end';

function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const gameResultRef = useRef<GameResult | null>(null);
  const didWinRef = useRef(false);

  switch (screen) {
    case 'landing':
      return <LandingScreen onStart={() => setScreen('game')} />;
    case 'game':
      return (
        <GameScreen
          onWin={(result) => {
            gameResultRef.current = result;
            didWinRef.current = true;
            setScreen('end');
          }}
          onLose={(result) => {
            gameResultRef.current = result;
            didWinRef.current = false;
            setScreen('end');
          }}
        />
      );
    case 'end': {
      const result = gameResultRef.current!;
      return (
        <EndScreen
          rogueSpend={result.rogueSpend}
          accuracy={result.accuracy}
          spendByDepartment={result.spendByDepartment}
          rogueSpendOverTime={result.rogueSpendTimeline}
          didWin={didWinRef.current}
          onRestart={() => {
            gameResultRef.current = null;
            setScreen('landing');
          }}
        />
      );
    }
  }
}

export default App;
