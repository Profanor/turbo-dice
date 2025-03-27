'use client';

import { useState, useRef, useEffect } from 'react';
import { FloatingTimer } from '@/components/floating-timer';
import { TimerContainer } from '@/components/game-timer';
import { DiceRollDisplay } from '@/components/dice-roll-display';
import Leaderboard from '@/components/tab-content';
import { LeaderboardTab, MyBetsSubTab, TopSubTab } from '@/components/tab-content';
import { ongoingBets, endedBets, topPlayers } from './mock-data';
import BetContainer from '@/components/bet-container';
import RecentResultsDisplay from '@/components/recent-results-display';
import GameHeader from '@/components/game-header';

const betAmounts = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];

export default function DiceBetGame() {
  // const [balance, setBalance] = useState(0);
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
  const [timer, setTimer] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('leaderboard');
  const [myBetsSubTab, setMyBetsSubTab] = useState<MyBetsSubTab>('ongoing');
  const [topSubTab, setTopSubTab] = useState<TopSubTab>('day');

  const autoBetCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollBets = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200 * (direction === 'left' ? -1 : 1);
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const rollDice = () => {
    if (!selectedBet) return;
    setRolling(true);
    setResult(null);

    if (!isTimerRunning) {
      startTimer();
    }

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

  const startTimer = () => {
    setIsTimerRunning(true);
    setTimer(10);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          setIsTimerRunning(false);
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (autoBet) {
      autoBetCountRef.current = 0;
    }
  }, [autoBet]);

  useEffect(() => {
    if (!rolling && result !== null && autoBet) {
      autoBetCountRef.current += 1;
      if (autoBetCountRef.current < autoBetRounds) {
        rollDice();
      } else {
        setAutoBet(false);
      }
    }
  }, [rolling, result, autoBet, autoBetRounds]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-start">
      {/* Header */}
      <GameHeader initialBalance={0} timer={timer} formatTime={formatTime} />

      <div className="w-full max-w-7xl px-4 sm:px-6 mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <RecentResultsDisplay recentResults={recentResults} />
            <DiceRollDisplay rolling={rolling} result={result} />
            <div className="flex flex-col sm:flex-row gap-4">
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

      <FloatingTimer timer={timer} formatTime={formatTime} />
    </div>
  );
}
