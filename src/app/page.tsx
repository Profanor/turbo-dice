'use client';

import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  DollarSign,
  Clock,
  User,
  MessageCircle,
  HelpCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const betAmounts = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];

type LeaderboardTab = 'leaderboard' | 'mybets' | 'top';
type MyBetsSubTab = 'ongoing' | 'ended';
type TopSubTab = 'day' | 'month' | 'year';

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
  const [timer, setTimer] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('leaderboard');
  const [myBetsSubTab, setMyBetsSubTab] = useState<MyBetsSubTab>('ongoing');
  const [topSubTab, setTopSubTab] = useState<TopSubTab>('day');

  const autoBetCountRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sample data for My Bets tab
  const ongoingBets = [
    { id: 'BET-001', score: 4, currentWin: 200 },
    { id: 'BET-002', score: 3, currentWin: 150 },
  ];

  const endedBets = [
    { id: 'BET-003', betAmount: 100, status: 'win' },
    { id: 'BET-004', betAmount: 200, status: 'loss' },
    { id: 'BET-005', betAmount: 500, status: 'win' },
  ];

  // sample data for Top tab
  const topPlayers = {
    day: [
      { date: 'Today', avatar: 'U1', betAmount: 1000, winAmount: 2500, round: 5 },
      { date: 'Today', avatar: 'U2', betAmount: 800, winAmount: 1600, round: 3 },
    ],
    month: [
      { date: 'March', avatar: 'U3', betAmount: 5000, winAmount: 12000, round: 15 },
      { date: 'March', avatar: 'U4', betAmount: 3500, winAmount: 8000, round: 10 },
    ],
    year: [
      { date: '2025', avatar: 'U5', betAmount: 25000, winAmount: 75000, round: 50 },
      { date: '2025', avatar: 'U6', betAmount: 18000, winAmount: 45000, round: 35 },
    ],
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

  const scrollBets = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200 * (direction === 'left' ? -1 : 1);
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // render the content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'leaderboard':
        return (
          <>
            {/* leaderboard header */}
            <div className="grid grid-cols-3 gap-2 mb-2 text-xs text-gray-400 font-semibold border-b border-gray-700 pb-2">
              <div>Player</div>
              <div>Score</div>
              <div>Current Win</div>
            </div>

            {leaderboard.slice(-5).map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`grid grid-cols-3 gap-2 py-2 px-3 mb-2 rounded-md ${
                  entry.status === 'win'
                    ? 'bg-green-500/20 border border-green-500/50'
                    : entry.status === 'loss'
                      ? 'bg-red-500/20 border border-red-500/50'
                      : index === 0
                        ? 'bg-yellow-500/20 border border-yellow-500/50'
                        : index === 1
                          ? 'bg-gray-400/20 border border-gray-400/50'
                          : index === 2
                            ? 'bg-amber-700/20 border border-amber-700/50'
                            : 'bg-gray-700/50'
                }`}
              >
                <div className="truncate">{entry.name}</div>
                <div>{entry.score}</div>
                <div
                  className={`font-bold ${
                    entry.status === 'win'
                      ? 'text-green-500'
                      : entry.status === 'loss'
                        ? 'text-red-500'
                        : 'text-yellow-400'
                  }`}
                >
                  {entry.score * 50}
                </div>
              </motion.div>
            ))}

            {leaderboard.length === 0 && (
              <div className="text-gray-400 text-sm italic py-2 text-center">No players yet</div>
            )}
          </>
        );

        {
          /* TAB MY BETS */
        }
      case 'mybets':
        return (
          <>
            {/* My Bets sub-tabs */}
            <div className="flex mb-4 border-b border-gray-700">
              <button
                onClick={() => setMyBetsSubTab('ongoing')}
                className={`px-4 py-2 text-sm font-medium ${
                  myBetsSubTab === 'ongoing'
                    ? 'text-sky-400 border-b-2 border-sky-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setMyBetsSubTab('ended')}
                className={`px-4 py-2 text-sm font-medium ${
                  myBetsSubTab === 'ended'
                    ? 'text-sky-400 border-b-2 border-sky-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Ended
              </button>
            </div>

            {myBetsSubTab === 'ongoing' ? (
              <>
                {/* Ongoing bets header */}
                <div className="grid grid-cols-3 gap-2 mb-2 text-xs text-gray-400 font-semibold border-b border-gray-700 pb-2">
                  <div>Bet ID</div>
                  <div>Score</div>
                  <div>Current Win</div>
                </div>

                {ongoingBets.map((bet, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="grid grid-cols-3 gap-2 py-2 px-3 mb-2 rounded-md bg-gray-700/50"
                  >
                    <div className="text-xs font-medium">{bet.id}</div>
                    <div className="text-yellow-400 font-bold">{bet.score}</div>
                    <div className="text-green-500 font-bold">{bet.currentWin}</div>
                  </motion.div>
                ))}

                {ongoingBets.length === 0 && (
                  <div className="text-gray-400 text-sm italic py-2 text-center">No ongoing bets</div>
                )}
              </>
            ) : (
              <>
                {/* Ended bets header */}
                <div className="grid grid-cols-3 gap-2 mb-2 text-xs text-gray-400 font-semibold border-b border-gray-700 pb-2">
                  <div>Bet ID</div>
                  <div>Bet Amount</div>
                  <div>Status</div>
                </div>

                {endedBets.map((bet, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`grid grid-cols-3 gap-2 py-2 px-3 mb-2 rounded-md ${
                      bet.status === 'win'
                        ? 'bg-green-500/20 border border-green-500/50'
                        : 'bg-red-500/20 border border-red-500/50'
                    }`}
                  >
                    <div className="text-xs font-medium">{bet.id}</div>
                    <div className="text-xs font-medium">{bet.betAmount}</div>
                    <div className="flex items-center">
                      {bet.status === 'win' ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />{' '}
                          <span className="text-green-500 text-xs font-medium">Win</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />{' '}
                          <span className="text-red-500 text-xs font-medium">Loss</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}

                {endedBets.length === 0 && (
                  <div className="text-gray-400 text-sm italic py-2 text-center">No ended bets</div>
                )}
              </>
            )}
          </>
        );
      case 'top':
        return (
          <>
            {/* Top sub-tabs with proper spacing */}
            <div className="flex mb-6 border-b border-gray-700 space-x-8 justify-center">
              <button
                onClick={() => setTopSubTab('day')}
                className={`px-6 py-2 text-sm font-medium ${
                  topSubTab === 'day' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setTopSubTab('month')}
                className={`px-6 py-2 text-sm font-medium ${
                  topSubTab === 'month' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTopSubTab('year')}
                className={`px-6 py-2 text-sm font-medium ${
                  topSubTab === 'year' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Year
              </button>
            </div>

            {topPlayers[topSubTab].map((player, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center px-6 py-5 mb-4 rounded-lg bg-gray-700/50"
              >
                {/* Trophy & Date */}
                <div className="flex flex-col items-center mr-10">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <span className="text-[10px] text-gray-300">{player.date}</span>
                </div>

                {/* Avatar */}
                <div className="flex items-center justify-center bg-gray-600 rounded-full h-8 w-8 text-white font-bold mr-6">
                  {player.avatar}
                </div>

                {/* Player Stats */}
                <div className="flex flex-col ml-12">
                  <div className="grid grid-cols-2">
                    <span className="text-[10px] text-gray-400">Bet Amount: </span>
                    <span className="text-[11px] text-white">{player.betAmount}</span>

                    <span className="text-[10px] text-gray-400">Win Amount: </span>
                    <span className="text-[11px] text-yellow-500">{player.winAmount}</span>

                    <span className="text-[10px] text-gray-400">Round: </span>
                    <span className="text-[11px] text-white">{player.round}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {topPlayers[topSubTab].length === 0 && (
              <div className="text-gray-400 text-sm italic py-2 text-center">No top players yet</div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-start">
      {/* header navbar */}
      <div className="w-full bg-gray-800/80 backdrop-blur-sm shadow-lg shadow-sky-500/10 py-3 px-4 sm:px-6 mb-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile header layout */}
          <div className="flex flex-col sm:hidden gap-3">
            {/* Top row: Logo and balance */}
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
                Turbo Dice
              </div>
              <div className="flex items-center text-md font-semibold text-green-500">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="animate-pulse">3000.00 USD</span>
              </div>
            </div>

            {/* Bottom row: How to play, user icons, and timer */}
            <div className="flex justify-between items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-medium px-4 py-1.5 rounded-full cursor-pointer flex items-center gap-1"
              >
                <HelpCircle className="h-3 w-3" />
                <span>How to play?</span>
              </motion.div>

              <div className="flex items-center gap-3">
                {/* Game timer in header for mobile */}
                <div className="flex items-center gap-1 bg-gray-700/50 px-2 py-1 rounded-full">
                  <Clock className="h-3 w-3 text-sky-400" />
                  <span className={`text-sm font-medium ${timer <= 5 ? 'text-red-500 animate-pulse' : 'text-sky-400'}`}>
                    {formatTime(timer)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-sky-500/20 p-1 rounded-full">
                    <User className="h-4 w-4 text-sky-400" />
                  </div>
                  <div className="bg-sky-500/20 p-1 rounded-full cursor-pointer hover:bg-sky-500/30 transition-colors">
                    <MessageCircle className="h-4 w-4 text-sky-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop header layout */}
          <div className="hidden sm:flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
                Turbo Dice
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-medium px-4 py-1.5 rounded-full cursor-pointer flex items-center gap-1"
              >
                <HelpCircle className="h-3 w-3" />
                <span>How to play?</span>
              </motion.div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center text-md font-semibold text-green-500">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="animate-pulse">3000.00 USD</span>
              </div>

              <div className="h-5 w-[1px] bg-gray-600"></div>

              <div className="flex items-center gap-2">
                <div className="bg-sky-500/20 p-1 rounded-full">
                  <User className="h-4 w-4 text-sky-400" />
                </div>
                <div className="bg-sky-500/20 p-1 rounded-full cursor-pointer hover:bg-sky-500/30 transition-colors">
                  <MessageCircle className="h-4 w-4 text-sky-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl px-4 sm:px-6 mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* recent rolls */}
            <div className="flex items-center space-x-4 overflow-x-auto">
              {recentResults.map((res, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="px-3 py-1 rounded-full bg-gray-700 text-yellow-400 font-bold"
                >
                  {res}
                </motion.div>
              ))}
              {recentResults.length === 0 && (
                <span className="text-gray-400 text-sm italic">No recent rolls yet...</span>
              )}
            </div>

            {/* dice container */}
            <Card className="relative w-full aspect-square sm:aspect-auto sm:h-[400px] md:h-[450px] lg:h-[500px] bg-black backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10">
              <div className="flex flex-col items-center justify-center h-full">
                <AnimatePresence mode="wait">
                  {rolling ? (
                    <motion.div
                      key="rolling"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5 }}
                      className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
                    >
                      🎲
                    </motion.div>
                  ) : result !== null ? (
                    <motion.div
                      key="result"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 sm:mb-6">🎲</span>
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
                      >
                        Score: {result}
                      </motion.span>
                    </motion.div>
                  ) : (
                    <span className="text-xl sm:text-2xl md:text-3xl text-gray-400 font-semibold text-center px-4">
                      Place your bet & roll!
                    </span>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {/* Responsive bet controls section */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Bet amount container with auto bet controls and roll button */}
              <Card className="w-full sm:w-3/4 bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-4">
                <div className="flex flex-col">
                  {/* Header with Select Bet Amount and Auto Bet controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
                      Select Bet Amount
                    </span>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-300">Auto Bet:</span>
                        <button
                          onClick={() => setAutoBet(!autoBet)}
                          title="button"
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 ${
                            autoBet ? 'bg-sky-500' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`${
                              autoBet ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </button>
                        <label className="text-xs text-gray-200">{autoBet ? 'On' : 'Off'}</label>
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor="autoBetRounds" className="text-xs text-gray-300">
                          Rounds:
                        </label>
                        <input
                          id="autoBetRounds"
                          type="number"
                          min={1}
                          value={autoBetRounds}
                          onChange={(e) => setAutoBetRounds(Number(e.target.value))}
                          className="bg-amber-50 w-12 p-1 text-xs text-black rounded border border-sky-400/50 focus:outline-none focus:ring-1 focus:ring-sky-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bet amounts and roll button */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2">
                    <div className="relative w-full flex-1 overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-transparent text-sky-400 hover:bg-gray-800/30"
                        onClick={() => scrollBets('left')}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div
                        ref={scrollContainerRef}
                        className="flex space-x-2 pb-2 px-8 overflow-x-auto scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {betAmounts.map((amount) => (
                          <motion.div key={amount} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant={selectedBet === amount ? 'default' : 'outline'}
                              onClick={() => setSelectedBet(amount)}
                              className={`px-3 py-2 text-sm transition-all flex-shrink-0 ${
                                selectedBet === amount
                                  ? `bg-sky-600 text-white border border-sky-500`
                                  : `bg-gray-800 text-gray-400 hover:bg-gray-700 opacity-40 hover:opacity-70`
                              }`}
                            >
                              {amount}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-transparent text-sky-400 hover:bg-gray-800/30"
                        onClick={() => scrollBets('right')}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Roll button placed below on mobile, beside on desktop */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full sm:w-auto sm:ml-2"
                    >
                      <Button
                        onClick={rollDice}
                        disabled={!selectedBet || rolling}
                        className="w-full sm:w-auto py-2 px-4 text-sm bg-gradient-to-r from-sky-400 to-white hover:from-sky-500 hover:to-sky-100 text-black font-bold transition-all duration-300"
                      >
                        {rolling ? 'Rolling...' : 'Bet & Roll'}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </Card>

              {/* Timer container - hidden on mobile */}
              <Card className="w-full sm:w-1/4 bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-4 hidden sm:block">
                <div className="flex flex-row sm:flex-col items-center sm:justify-center h-full gap-4 sm:gap-0">
                  <span className="text-xs mb-0 sm:mb-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Game Timer
                  </span>
                  <div className="flex flex-col items-center">
                    <div className={`text-xl font-bold ${timer <= 5 ? 'text-red-500 animate-pulse' : 'text-sky-400'}`}>
                      {formatTime(timer)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {isTimerRunning ? 'Game in progress' : 'Waiting to start'}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Redesigned leaderboard section with tabs */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {/* Tab navigation */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-full border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-1 flex">
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

            {/* Players count */}
            <div className="text-xs font-medium text-sky-400 bg-sky-400/10 px-3 py-1.5 rounded-full self-start">
              Joins: {leaderboard.length}
            </div>

            {/* Tab content container */}
            <Card className="w-full bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-4">
              {renderTabContent()}

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
      <div className="fixed bottom-4 right-4 z-50 bg-gray-800/90 backdrop-blur-sm rounded-full border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-2 sm:hidden">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-sky-400" />
          <div className={`text-lg font-bold ${timer <= 5 ? 'text-red-500 animate-pulse' : 'text-sky-400'}`}>
            {formatTime(timer)}
          </div>
        </div>
      </div>
    </div>
  );
}
