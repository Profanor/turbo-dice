import { DollarSign, HelpCircle, Clock, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGameSocket } from '@/app/socketService';
import { motion } from 'framer-motion';
import { decryptData } from '@/lib/crypto-utils';
import UserDropdown from './user-dropdown';

const user = '/assets/images/user.jpeg';

interface GameHeaderProps {
  initialBalance: number;
  timer: number;
  formatTime: (time: number) => string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ initialBalance, timer, formatTime }) => {
  const { isConnected, emitEvent, onEvent } = useGameSocket('ATyIui7r', 'U2FsdGVkX18RhZRcTnKv5FVO%2FaKMfFLGRyMCt0sNPNq41M%2Bl2OQfzSD1%2FV5Xya%2BWjcK2gH8Y4D8dioctTVYjXB70FLlpm%2FkG6DwOZ%2FLZ182R7dfCBT0HCixiwS8zGMEnNNQBmD624WQQLw8uERVpEg63zKUjzCqisgP5DxIitaRYFEoTrttER9uLa%2FhShZaU3NHiqMDqbc3ues7%2BgKXyPw%3D%3D');

  const [ balance, setBalance ] = useState(initialBalance);

  useEffect(() => {
  console.log('GameHeader Mounted');
  console.log('WebSocket Connection Status:', isConnected);

  onEvent('get_user_balance', (encryptedData: string) => {

    const decrypted = decryptData(encryptedData);

    if (decrypted && decrypted.balance !== undefined) {
      setBalance(decrypted.balance);
      console.log('Balance', decrypted.balance)
    } else {
      console.error('Decryption failed or invalid balance data');
    }
  });
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
              <span className="animate-pulse">{balance} USD</span>
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
              <span className="animate-pulse">{balance} USD</span>
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
