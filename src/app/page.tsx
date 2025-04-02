'use client';

import { useRef, useState } from 'react';
import BetContainer from '@/components/bet-container';
import BetButtonContainer from '@/components/bet-roll-button-container';
import { DiceRollDisplay } from '@/components/dice-roll-display';
import GameHeader from '@/components/game-header';
import { TimerContainer } from '@/components/game-timer';
import RecentResultsDisplay from '@/components/recent-results-display';
import type { LeaderboardTab, MyBetsSubTab, TopSubTab } from '@/components/tab-content';
import Leaderboard from '@/components/tab-content';
import { useAutoBet } from './hooks/useAutoBet';
import { endedBets, ongoingBets, topPlayers } from './mock-data';
import { useGameSocket } from './socketService';

export default function DiceBetGame() {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
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

  const { userSelectedActiveGame } = useGameSocket();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const rollDice = () => {
    if (!userSelectedActiveGame) return;

    setRolling(true);
    setResult(null);

    setTimeout(() => {
      const finalResult = Math.floor(Math.random() * 6) + 1;

      setResult(finalResult);
      // setRecentResults((prev) => {
      //   const updated = [finalResult, ...prev];
      //   return updated.slice(0, 8);
      // });

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
          <div className="w-full lg:w-2/3 flex flex-col gap-3">
            <RecentResultsDisplay />
            <DiceRollDisplay />
            <div className="flex flex-col sm:flex-row gap-2">
              <BetContainer
                autoBet={autoBet}
                setAutoBet={setAutoBet}
                autoBetRounds={autoBetRounds}
                setAutoBetRounds={setAutoBetRounds}
                rolling={rolling}
                rollDice={rollDice}
                scrollBets={scrollBets}
              />

              {/* desktop layout - only timer */}
              <div className="hidden sm:block sm:w-1/4">
                <TimerContainer />
              </div>

              {/* mobile layout */}
              <div className="flex flex-row gap-2 sm:hidden w-full">
                <div className="w-1/2">
                  <BetButtonContainer />
                </div>
                <div className="w-1/2">
                  <TimerContainer />
                </div>
              </div>
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
    </div>
  );
}
