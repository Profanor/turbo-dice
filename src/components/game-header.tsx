import { DollarSign, HelpCircle, Clock, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGameSocket } from '@/app/socketService';
import { motion } from 'framer-motion';
import UserDropdown from './user-dropdown';

const user = '/assets/images/user.jpeg';

interface GameHeaderProps {
  initialBalance: number;
  timer: number;
  formatTime: (time: number) => string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ initialBalance, timer, formatTime }) => {
  const { isConnected, emitEvent, onEvent } = useGameSocket('lw8c5kGI', 'U2FsdGVkX1%2Bz37p8imvFyO%2FvGP3bCt09Todz3RIRUvSVMwiex11xmP3QK2RYrlpIhYHmH9mn%2F61Vhqma1C0ztGCJy4rIw8NcHiiTS%2FxYh3qi9v7dSPmpo5ZCkCYu42nWD5yoymfBDxF4o0GeLIL25SOwo2ofo315eM0zKCFgUoPjIt5ahWkwymdhxYTOoFEsLW7j13QfBSOhDe0BpLzZDw%3D%3D');

  const [balance, setBalance] = useState(initialBalance);

  useEffect(() => {
    console.log('GameHeader Mounted');
    console.log('WebSocket Connection Status:', isConnected);

    if (isConnected) {
      const data = JSON.stringify({ userId: 'dave123', gameId: 'examp123' }); 
      emitEvent('game:join', data);

      // listen for balance updates
      onEvent('game:balanceUpdate', (data: { balance: number }) => {
        console.log('Received balance update:', data.balance);
        setBalance(data.balance);
      });
    }
  }, [isConnected, emitEvent, onEvent]);

  return (
    <div className="w-full bg-gray-800/80 backdrop-blur-sm shadow-lg shadow-sky-500/10 py-3 px-4 sm:px-6 mb-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile header layout */}
        <div className="flex flex-col sm:hidden gap-3">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
              Turbo Dice
            </div>
            <div className="flex items-center text-md font-semibold text-green-500">
              <DollarSign className="w-4 h-4 mr-1" />
              <span className="animate-pulse">{balance.toFixed(2)} USD</span>
            </div>
          </div>
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
              <div className="flex items-center gap-1 bg-gray-700/50 px-2 py-1 rounded-full">
                <Clock className="h-3 w-3 text-sky-400" />
                <span className={`text-sm font-medium ${timer <= 5 ? 'text-red-500 animate-pulse' : 'text-sky-400'}`}>
                  {formatTime(timer)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <UserDropdown userImage={user} />
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
              <span className="animate-pulse">{balance.toFixed(2)} USD</span>
            </div>
            <div className="h-5 w-[1px] bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <div>
                <UserDropdown userImage={user} />
              </div>
              <div className="bg-sky-500/20 p-1 rounded-full cursor-pointer hover:bg-sky-500/30 transition-colors">
                <MessageCircle className="h-4 w-4 text-sky-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
