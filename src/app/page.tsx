'use client';

import { useState, useRef } from 'react';
// import { FloatingTimer } from '@/components/floating-timer';
import { TimerContainer } from '@/components/game-timer';
import { DiceRollDisplay } from '@/components/dice-roll-display';
import { LeaderboardTab, MyBetsSubTab, TopSubTab } from '@/components/tab-content';
import { ongoingBets, endedBets, topPlayers } from './mock-data';
import { useGameTimer } from './hooks/useGameTimer';
import { useAutoBet } from './hooks/useAutoBet';
import { formatTime } from '@/utils/time';
import BetContainer from '@/components/bet-container';
import Leaderboard from '@/components/tab-content';
import GameHeader from '@/components/game-header';
import RecentResultsDisplay from '@/components/recent-results-display';
// import BetButtonContainer from '@/components/bet-roll-button-container';

const betAmounts = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];

export default function DiceBetGame() {
  const [selectedBet, setSelectedBet] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [recentResults, setRecentResults] = useState<number[]>([]);
  const [leaderboard, setLeaderboard] = useState<
    {
      name: string;
      score: number;
      position: number;
      status: 'active' | 'win' | 'loss';
    }[]
  >([]);
  const [autoBet, setAutoBet] = useState(false);
  const [autoBetRounds, setAutoBetRounds] = useState(1);
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('leaderboard');
  const [myBetsSubTab, setMyBetsSubTab] = useState<MyBetsSubTab>('ongoing');
  const [topSubTab, setTopSubTab] = useState<TopSubTab>('day');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const endGame = () => {
    setLeaderboard((prev) =>
      prev.map((player) => {
        const isWin = player.score > 3;
        return {
          ...player,
          status: isWin ? 'win' : 'loss',
        };
      }),
    );
  };

  const { timer, isRunning: isTimerRunning, startTimer } = useGameTimer(10, endGame);

  const rollDice = () => {
    if (!selectedBet) return;

    setRolling(true);
    setResult(null);

    if (!isTimerRunning) startTimer();

    setTimeout(() => {
      const finalResult = Math.floor(Math.random() * 6) + 1;

      setResult(finalResult);
      setRecentResults((prev) => {
        const updated = [finalResult, ...prev];
        return updated.slice(0, 8);
      });

      const newPosition = leaderboard.length + 1;
      setLeaderboard((prev) => [
        ...prev,
        {
          name: `User${prev.length + 1}`,
          score: finalResult,
          position: newPosition,
          status: 'active',
        },
      ]);
      setRolling(false);

      setTimeout(() => setResult(null), 1000);
    }, 1000);
  };

  useAutoBet(rolling, result, autoBet, autoBetRounds, rollDice, setAutoBet);

  const scrollBets = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = scrollContainerRef.current.clientWidth * 0.5 * (direction === 'left' ? -1 : 1);

    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#1E1E1E] text-white flex flex-col items-start">
      {/* Header */}
      <GameHeader initialBalance={0} />

      <div className="w-full max-w-7xl px-4 sm:px-6 mx-auto">
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            <RecentResultsDisplay recentResults={recentResults} />
            <DiceRollDisplay rolling={rolling} result={result} />
            <div className="flex flex-col sm:flex-row gap-2">
              <BetContainer
                selectedBet={selectedBet}
                setSelectedBet={setSelectedBet}
                autoBet={autoBet}
                setAutoBet={setAutoBet}
                autoBetRounds={autoBetRounds}
                setAutoBetRounds={setAutoBetRounds}
                rolling={rolling}
                rollDice={rollDice}
                betAmounts={betAmounts}
                scrollBets={scrollBets}
              />
              <TimerContainer timer={timer} formatTime={formatTime} isTimerRunning={isTimerRunning} />
            </div>
          </div>

          {/* leaderboard section */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full">
            <Leaderboard
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              myBetsSubTab={myBetsSubTab}
              setMyBetsSubTab={setMyBetsSubTab}
              topSubTab={topSubTab}
              setTopSubTab={setTopSubTab}
              leaderboard={leaderboard}
              ongoingBets={ongoingBets}
              endedBets={endedBets}
              topPlayers={topPlayers}
            />
          </div>
        </div>
      </div>

      {/* <FloatingTimer timer={timer} formatTime={formatTime} /> */}
    </div>
  );
}
