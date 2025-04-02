'use client';

import moment, { Moment } from 'moment';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { decryptData, encryptData } from '@/lib/crypto-utils';

const SOCKET_URL = process.env.API_BASE_URL || '';

interface GameSocketContextType {
  isConnected: boolean;
  balance: number;
  currency: string;
  activeGames: InstantTournament[];
  emitEvent: (event: string, data: string) => void;
  setUserSelectedActiveGame: React.Dispatch<React.SetStateAction<InstantTournament | undefined>>;
  userSelectedActiveGame?: InstantTournament;
  handleRollGame: () => void;
  isRollingGame: boolean;
  userSelectedActiveGameResponse?: RolledInstantTournamentGameResponse;
  playerRecentRolls: number[];
  timeLeft?: GameTimer;
}

const GameSocketContext = createContext<GameSocketContextType>({
  isConnected: false,
  balance: 0,
  currency: 'NGN',
  activeGames: [],
  emitEvent: () => {},
  setUserSelectedActiveGame: () => {},
  userSelectedActiveGame: undefined,
  handleRollGame: () => {},
  isRollingGame: false,
  userSelectedActiveGameResponse: undefined,
  playerRecentRolls: [],
  timeLeft: undefined,
});

interface InstantTournament {
  id: number;
  merchantId: number;
  name: string;
  slug: string;
  stake: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  durationType: string;
  maxNoOfPlayers: number;
  status: string;
  processed: boolean;
  noOfPlayersJoined: number;
  tournamentCalculationFormula: number;
  amountToFirstOnFull: number;
  amountToFirst: number;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
  numberOfWinners: string;
}

export interface RolledInstantTournamentGameResponse {
  tournament: InstantTournament;
  record: Record;
}

export interface Record {
  id: number;
  instantTournamentId: number;
  score: number;
  username: string;
  isPlayed: boolean;
  reference: string;
  playerId: string;
  playedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  processedForPayout: boolean;
}

interface GameTimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const GameSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('NGN');
  const [activeGames, setActiveGames] = useState<InstantTournament[]>([]);

  const [userSelectedActiveGame, setUserSelectedActiveGame] = useState<InstantTournament | undefined>();
  const [userSelectedActiveGameResponse, setUserSelectedActiveGameResponse] = useState<
    RolledInstantTournamentGameResponse | undefined
  >();
  const [isRollingGame, setIsRollingGame] = useState(false);

  const [playerRecentRolls, setPlayerRecentRolls] = useState<number[]>([]);

  const [timeLeft, setTimeLeft] = useState<GameTimer | undefined>();

  const calculateTimeLeft = (endDate: Moment) => {
    const now = moment();
    const duration = moment.duration(endDate.diff(now));

    return {
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  };

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || '';
    const cesLoad = process.env.NEXT_PUBLIC_HASH || '';

    console.log('Initializing WebSocket connection...');

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true,
      query: { clientId, hash: cesLoad },
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection Error:', err);
    });

    socket.on('error', (err) => {
      console.error('Socket Error:', err);
    });

    socket.on('get_user_balance', (encryptedData: string) => {
      try {
        const decrypted = decryptData(encryptedData);
        if (decrypted && decrypted.balance !== undefined && decrypted.currency) {
          setBalance(decrypted.balance);
          setCurrency(decrypted.currency);
        } else {
          console.error('Decryption failed or invalid balance data');
        }
      } catch (error) {
        console.error('Error decrypting data:', error);
      }
    });

    socket.on('get_player_instant_tournament_recent_rolls', (encryptedData: string) => {
      try {
        const decrypted = decryptData(encryptedData);
        setPlayerRecentRolls(decrypted?.rolls);
      } catch (error) {
        console.error('Error decrypting data:', error);
      }
    });

    socket.on('available_instant_tournament_games', (encryptedData: string) => {
      try {
        const decrypted = decryptData(encryptedData);
        if (decrypted) {
          setActiveGames(decrypted?.games);
        } else {
          console.error('Decryption failed');
        }
      } catch (error) {
        console.error('Error decrypting data:', error);
      }
    });

    socket.on('played_instant_tournament_game', (encryptedData: string) => {
      try {
        const decrypted = decryptData(encryptedData) as RolledInstantTournamentGameResponse;
        setIsRollingGame(false);
        setUserSelectedActiveGameResponse(decrypted);
        setPlayerRecentRolls((prev) => [decrypted?.record?.score, ...prev]);
      } catch (error) {
        console.error('Error decrypting data:', error);
      }
    });

    return () => {
      console.log('Cleaning up WebSocket connection...');
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (userSelectedActiveGame) {
      emitEvent(
        'get_player_instant_tournament_recent_rolls',
        encryptData({ instantTournamentId: userSelectedActiveGame?.id }),
      );

      const timer = setInterval(() => {
        const calcTimeLeft = calculateTimeLeft(moment(userSelectedActiveGame?.endDate));
        setTimeLeft(calcTimeLeft);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [userSelectedActiveGame]);

  const emitEvent = (event: string, data: string, callback?: <T>(val: T) => void) => {
    socketRef.current?.emit(event, data, (val: unknown) => {
      callback?.(val);
    });
  };

  const handleRollGame = () => {
    if (!userSelectedActiveGame) {
      alert('No game selected');
    } else {
      setIsRollingGame(true);
      emitEvent('play_instant_tournament_game', encryptData({ instantTournamentId: userSelectedActiveGame?.id }));
    }
  };

  return (
    <GameSocketContext.Provider
      value={{
        isConnected,
        balance,
        currency,
        emitEvent,
        activeGames,
        setUserSelectedActiveGame,
        userSelectedActiveGame,
        handleRollGame,
        isRollingGame,
        userSelectedActiveGameResponse,
        playerRecentRolls,
        timeLeft,
      }}
    >
      {children}
    </GameSocketContext.Provider>
  );
};

export const useGameSocket = () => {
  const context = useContext(GameSocketContext);
  if (!context) {
    throw new Error('useGameSocket must be used within a GameSocketProvider');
  }
  return context;
};
