/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.API_BASE_URL;

export const useGameSocket = (clientId: string, cesLoad: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (cesLoad) {
      console.log('Initializing WebSocket connection...');

      socketRef.current = io(`${SOCKET_URL}`, {
        // transports: ['websocket'],
        query: {
          clientId,
          hash: cesLoad,
        },
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

      return () => {
        console.log('Cleaning up WebSocket connection...');
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [clientId, cesLoad]);

  const emitEvent = (event: string, data: string) => {
    socketRef.current?.emit(event, data);
  };

  const onEvent = (event: string, callback: (data: any) => void) => {
    socketRef.current?.on(event, callback);
  };

  return { isConnected, emitEvent, onEvent };
};
