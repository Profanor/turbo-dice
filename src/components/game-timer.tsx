import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useGameSocket } from '@/app/socketService';
import { cn } from '@/lib/utils';

export const TimerContainer = () => {
  const { timeLeft } = useGameSocket();
  console.log((timeLeft?.seconds ?? 10) <= 5);
  return (
    <Card className="w-full bg-gray-800/80 backdrop-blur-sm rounded-lg border-1 border-sky-500/30 shadow-lg shadow-sky-500/10 p-4 h-full">
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <span className="text-xs mb-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white flex items-center">
          <Clock className="h-3 w-3 mr-1" /> Game Timer
        </span>
        <div className="flex flex-col items-center">
          <div
            className={cn(
              'text-xl font-bold',
              (timeLeft?.seconds ?? 10) <= 5 ? 'text-red-500 animate-pulse' : 'text-sky-400',
            )}
          >
            {`${timeLeft?.days ? `${timeLeft?.days}d` : ''} ${timeLeft?.hours ? `${timeLeft?.hours}h` : ''} ${timeLeft?.minutes ? `${timeLeft?.minutes}m` : ''} ${timeLeft?.seconds ? `${timeLeft?.seconds}s` : ''}`}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {timeLeft?.seconds ? 'Game in progress' : 'Waiting to start'}
          </div>
        </div>
      </div>
    </Card>
  );
};
