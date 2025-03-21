'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { FloatingTimer } from '@/components/floating-timer';
import { PlayersCount } from '@/components/players-count';
import { TimerContainer } from '@/components/game-timer';
import { DiceRollDisplay } from '@/components/dice-roll-display';
import { TabContent } from '@/components/leaderboard';
import { ongoingBets, endedBets, topPlayers } from './mock-data';
import BetContainer from '@/components/bet-container';
import RecentResultsDisplay from '@/components/recent-results-display';
import GameHeader from '@/components/game-header';

const betAmounts = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];

type LeaderboardTab = 'leaderboard' | 'mybets' | 'top';
type MyBetsSubTab = 'ongoing' | 'ended';
type TopSubTab = 'day' | 'month' | 'year';

export default function DiceBetGame() {
  const [balance, setBalance] = useState(0);
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
    setResult(null); // clear the previous result immediately

    // start the timer when rolling
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

      // add player to leaderboard
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

      // hide the result after 1 second
      setTimeout(() => setResult(null), 1000);
    }, 1000);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    setTimer(10); // reset to default

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          // timer finished
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
    // update leaderboard statuses
    setLeaderboard((prev) =>
      prev.map((player) => {
        // determine win/loss based on score for now scores > 3 are wins
        const isWin = player.score > 3;
        return {
          ...player,
          status: isWin ? 'win' : 'loss',
        };
      }),
    );
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('/api/balance');
        if (!response) {
          throw new Error(`API error: ${Error}`);
        }
        const data = await response.json();
        setBalance(data.balance);
      } catch (error) {
        console.error('Failed to fetch balance', error);
      }
    };

    fetchBalance();
  }, []);

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
  }, [rolling, result, autoBet, autoBetRounds]); // Removed rollDice from dependencies

  useEffect(() => {
    // cleanup timer on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const renderTabContent = () => {
    return (
      <TabContent
        activeTab={activeTab}
        ongoingBets={ongoingBets}
        endedBets={endedBets}
        topPlayers={topPlayers}
        leaderboard={leaderboard}
        myBetsSubTab={myBetsSubTab}
        setMyBetsSubTab={setMyBetsSubTab}
        topSubTab={topSubTab}
        setTopSubTab={setTopSubTab}
      />
    );
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-start">
      {/* header navbar */}
      <GameHeader balance={balance} timer={timer} formatTime={formatTime} />

      <div className="w-full max-w-7xl px-4 sm:px-6 mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* recent rolls */}
            <RecentResultsDisplay recentResults={recentResults} />

            {/* dice container */}
            <DiceRollDisplay rolling={rolling} result={result} />

            {/* bet controls section */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* bet container */}
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

              {/* timer container - hidden on mobile */}
              <TimerContainer timer={timer} formatTime={formatTime} isTimerRunning={isTimerRunning} />
            </div>
          </div>

          {/* leaderboard section with tabs */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full">
            {/* Tab content container */}
            <Card className="w-full flex flex-col bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-4 min-h-[700px]">
              {/* Tab navigation */}
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-full border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-1 flex mb-4">
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
                    activeTab === 'leaderboard' ? 'bg-black text-sky-400' : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => setActiveTab('mybets')}
                  className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
                    activeTab === 'mybets' ? 'bg-black text-sky-400' : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  My Bets
                </button>
                <button
                  onClick={() => setActiveTab('top')}
                  className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
                    activeTab === 'top' ? 'bg-black text-sky-400' : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Top
                </button>
              </div>

              {/* Players count (joins) */}
              <PlayersCount count={leaderboard.length} />

              {/* Main content should push items to the bottom before scrolling */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="flex flex-col h-full justify-between">{renderTabContent()}</div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                <span className="text-xs text-gray-400">This game is powered by</span>
                <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
                  Smatvirtual
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating timer for mobile */}
      <FloatingTimer timer={timer} formatTime={formatTime} />
    </div>
  );
}
