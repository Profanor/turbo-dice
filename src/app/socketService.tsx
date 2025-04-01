"use client"
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { decryptData } from "@/lib/crypto-utils";

const SOCKET_URL = process.env.API_BASE_URL || "";

interface GameSocketContextType {
  isConnected: boolean;
  balance: number;
  currency: string;
  activeGames: InstantTournament[], 
  emitEvent: (event: string, data: string) => void;
}

const GameSocketContext = createContext<GameSocketContextType>({
  isConnected: false,
  balance: 0,
  currency: "NGN",
  activeGames: [], 
  emitEvent: () => {},
});

interface InstantTournament {
  id:                           number;
  merchantId:                   number;
  name:                         string;
  slug:                         string;
  stake:                        number;
  currency:                     string;
  startDate:                    Date;
  endDate:                      Date;
  duration:                     number;
  durationType:                 string;
  maxNoOfPlayers:               number;
  status:                       string;
  processed:                    boolean;
  noOfPlayersJoined:            number;
  tournamentCalculationFormula: number;
  amountToFirstOnFull:          number;
  amountToFirst:                number;
  reference:                    string;
  createdAt:                    Date;
  updatedAt:                    Date;
  numberOfWinners:              string;
}


export const GameSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState("NGN");
  const [activeGames, setActiveGames] = useState<InstantTournament[]>([])

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "";
    const cesLoad = process.env.NEXT_PUBLIC_HASH || "";

    console.log("Initializing WebSocket connection...");

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      query: { clientId, hash: cesLoad },
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection Error:", err);
    });

    socket.on("error", (err) => {
      console.error("Socket Error:", err);
    });

    socket.on("get_user_balance", async (encryptedData: string) => {
      try {
        const decrypted = await decryptData(encryptedData);
        if (decrypted && decrypted.balance !== undefined && decrypted.currency) {
          setBalance(decrypted.balance);
          setCurrency(decrypted.currency);
          console.log("Balance:", decrypted.balance, "Currency:", decrypted.currency);
        } else {
          console.error("Decryption failed or invalid balance data");
        }
      } catch (error) {
        console.error("Error decrypting data:", error);
      }
    });

    socket.on("available_instant_tournament_games", async (encryptedData: string) => {
      try {
        const decrypted = await decryptData(encryptedData);
        if (decrypted) {
          setActiveGames(decrypted)
          console.log("Decrypted Instant Tournament Data:", decrypted)
        } else {
           console.error("Decryption failed");
        }
      } catch (error) {
        console.error("Error decrypting data:", error);
      }
    })

    return () => {
      console.log("Cleaning up WebSocket connection...");
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const emitEvent = (event: string, data: string) => {
    socketRef.current?.emit(event, data);
  };

  return (
    <GameSocketContext.Provider value={{ isConnected, balance, currency, emitEvent, activeGames }}>
      {children}
    </GameSocketContext.Provider>
  );
};

export const useGameSocket = () => {
  const context = useContext(GameSocketContext);
  if (!context) {
    throw new Error("useGameSocket must be used within a GameSocketProvider");
  }
  return context;
};
