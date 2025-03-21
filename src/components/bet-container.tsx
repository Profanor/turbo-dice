import { FC, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface BetContainerProps {
  autoBet: boolean;
  setAutoBet: (value: boolean) => void;
  autoBetRounds: number;
  setAutoBetRounds: (value: number) => void;
  betAmounts: number[];
  selectedBet: number | null;
  setSelectedBet: (value: number) => void;
  scrollBets: (direction: 'left' | 'right') => void;
  rollDice: () => void;
  rolling: boolean;
}

const BetContainer: FC<BetContainerProps> = ({
  autoBet,
  setAutoBet,
  autoBetRounds,
  setAutoBetRounds,
  betAmounts,
  selectedBet,
  setSelectedBet,
  rollDice,
  rolling,
}) => {
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

  return (
    <Card className="w-full sm:w-3/4 bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-4">
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
            Select Bet Amount
          </span>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-300">Auto Bet:</span>
              <button
                onClick={() => setAutoBet(!autoBet)}
                type="button"
                title="Auto Bet"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 ${
                  autoBet ? 'bg-sky-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`${autoBet ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
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
                        ? 'bg-sky-600 text-white border border-sky-500'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 opacity-40 hover:opacity-70'
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
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto sm:ml-2">
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
  );
};

export default BetContainer;
