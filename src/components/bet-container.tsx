'use client';

import { type FC, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameSocket } from '@/app/socketService';

interface BetContainerProps {
  autoBet: boolean;
  setAutoBet: (value: boolean) => void;
  autoBetRounds: number;
  setAutoBetRounds: (value: number) => void;
  scrollBets: (direction: 'left' | 'right') => void;
  rollDice: () => void;
  rolling: boolean;
}

const BetContainer: FC<BetContainerProps> = ({ autoBet, setAutoBet, autoBetRounds, setAutoBetRounds, rolling }) => {
  const { activeGames, setUserSelectedActiveGame, userSelectedActiveGame, handleRollGame, isRollingGame } =
    useGameSocket();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollBets = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = scrollContainerRef.current.clientWidth * 0.5 * (direction === 'left' ? -1 : 1);

    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <Card className="w-full sm:w-3/4 bg-gray-800/80 backdrop-blur-sm rounded-lg border-1 border-sky-500/30 shadow-lg shadow-sky-500/10 p-4">
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between gap-3 mb-4 w-full">
          <span className="text-[10px] sm:text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
            Select Bet Amount
          </span>
          <div className="flex flex-nowrap items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-300">Auto Bet</span>
              <button
                onClick={() => setAutoBet(!autoBet)}
                type="button"
                title="Auto Bet"
                className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 ${
                  autoBet ? 'bg-sky-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`${autoBet ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
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
                className="bg-amber-50 w-10 p-1 text-xs text-black rounded border border-sky-400/50 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>
          </div>
        </div>

        {/* betting controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* left chevron outside the scroll area */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 bg-gray-800/50 text-sky-400 hover:bg-gray-800/70 z-10"
            onClick={() => scrollBets('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* scrollable bet amounts container */}
          <div className="relative flex-1 overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="flex space-x-2 pb-2 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {activeGames?.map((game) => (
                <motion.div key={game?.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={userSelectedActiveGame?.id === game?.id ? 'default' : 'outline'}
                    onClick={() => setUserSelectedActiveGame(game)}
                    className={`px-3 py-2 text-sm transition-all flex-shrink-0 ${
                      userSelectedActiveGame?.id === game?.id
                        ? 'bg-sky-600 text-white border border-sky-500'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 opacity-40 hover:opacity-70'
                    }`}
                  >
                    {game?.stake}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* right chevron outside the scroll area */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 bg-gray-800/50 text-sky-400 hover:bg-gray-800/70 z-10"
            onClick={() => scrollBets('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* bet & roll button */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden sm:block flex-shrink-0">
            <Button
              onClick={handleRollGame}
              disabled={!userSelectedActiveGame || isRollingGame}
              className="w-full sm:w-auto py-2 px-4 text-sm bg-gradient-to-r from-sky-400 to-white hover:from-sky-500 hover:to-sky-100 text-black font-bold transition-all duration-300"
            >
              {rolling ? 'Rolling...' : 'Bet & Roll'}
            </Button>
          </motion.div>
        </div>
      </div>
    </Card>
  );
};

export default BetContainer;
