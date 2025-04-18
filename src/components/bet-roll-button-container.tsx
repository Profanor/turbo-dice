'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { useGameSocket } from '@/app/socketService';

const BetButtonContainer = () => {
  const { userSelectedActiveGame, handleRollGame, isRollingGame } = useGameSocket();

  return (
    <Card className="w-full bg-gray-800/80 backdrop-blur-sm rounded-lg border-1 border-sky-500/30 shadow-lg shadow-sky-500/10 p-4 h-full">
      <div className="flex flex-col items-center justify-center h-full">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
          <Button
            onClick={handleRollGame}
            disabled={!userSelectedActiveGame || isRollingGame}
            className="w-full h-full min-h-[70px] py-3 px-4 text-sm bg-gradient-to-r from-sky-400 to-white hover:from-sky-500 hover:to-sky-100 text-black font-bold transition-all duration-300"
          >
            {isRollingGame ? 'Rolling...' : 'Bet & Roll'}
          </Button>
        </motion.div>
      </div>
    </Card>
  );
};

export default BetButtonContainer;
