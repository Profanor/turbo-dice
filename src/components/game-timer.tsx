import { FC } from 'react';
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TimerContainerProps {
  timer: number;
  formatTime: (time: number) => string;
  isTimerRunning: boolean;
}

export const TimerContainer: FC<TimerContainerProps> = ({ timer, formatTime, isTimerRunning }) => {
  return (
    <Card className="w-full sm:w-1/4 bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-4 hidden sm:block">
      <div className="flex flex-row sm:flex-col items-center sm:justify-center h-full gap-4 sm:gap-0">
        <span className="text-xs mb-0 sm:mb-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white flex items-center">
          <Clock className="h-3 w-3 mr-1" /> Game Timer
        </span>
        <div className="flex flex-col items-center">
          <div className={`text-xl font-bold ${timer <= 5 ? 'text-red-500 animate-pulse' : 'text-sky-400'}`}>
            {formatTime(timer)}
          </div>
          <div className="text-xs text-gray-400 mt-1">{isTimerRunning ? 'Game in progress' : 'Waiting to start'}</div>
        </div>
      </div>
    </Card>
  );
};
