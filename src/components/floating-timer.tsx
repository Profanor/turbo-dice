import { Clock } from "lucide-react";

interface FloatingTimerProps {
  timer: number;
  formatTime: (time: number) => string;
}
export const FloatingTimer = ({ timer, formatTime }: FloatingTimerProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-800/90 backdrop-blur-sm rounded-full border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-2 sm:hidden">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-sky-400" />
        <div className={`text-lg font-bold ${timer <= 5 ? 'text-red-500 animate-pulse' : 'text-sky-400'}`}>
          {formatTime(timer)}
        </div>
      </div>
    </div>
  );
};
