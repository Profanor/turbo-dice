'use client';

import type { FC } from 'react';
import { Card } from '@/components/ui/card';
// import { useGameSocket } from '@/app/socketService';
import { motion, AnimatePresence } from 'framer-motion';

interface DiceRollDisplayProps {
  rolling: boolean;
  result: number | null;
}

export const DiceRollDisplay: FC<DiceRollDisplayProps> = ({ rolling, result }) => {
  // const { isConnected, emitEvent, onEvent } = useGameSocket('ATyIui7r', 'U2FsdGVkX18RhZRcTnKv5FVO%2FaKMfFLGRyMCt0sNPNq41M%2Bl2OQfzSD1%2FV5Xya%2BWjcK2gH8Y4D8dioctTVYjXB70FLlpm%2FkG6DwOZ%2FLZ182R7dfCBT0HCixiwS8zGMEnNNQBmD624WQQLw8uERVpEg63zKUjzCqisgP5DxIitaRYFEoTrttER9uLa%2FhShZaU3NHiqMDqbc3ues7%2BgKXyPw%3D%3D');
  return (
    <Card className="relative w-full h-[250px] sm:h-[400px] md:h-[450px] lg:h-[500px] bg-black backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10">
      <div className="flex flex-col items-center justify-center h-full">
        <AnimatePresence mode="wait">
          {rolling ? (
            <motion.div
              key="rolling"
              animate={{ rotate: 360 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5 }}
              className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl"
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
              <span className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl mb-2 sm:mb-6">🎲</span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
              >
                Score: {result}
              </motion.span>
            </motion.div>
          ) : (
            <span className="text-lg sm:text-2xl md:text-3xl text-gray-400 font-semibold text-center px-4">
              Place your bet & roll!
            </span>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
