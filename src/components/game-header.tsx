"use client"

import type React from "react"
import { HelpCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useGameSocket } from "@/app/socketService"
import { motion } from "framer-motion"
import UserDropdown from "./user-dropdown"
import Image from "next/image"

const user = "/assets/images/turbo_avatar.svg";
const howToPlay = "/assets/images/how_to_play.svg";
const chat = "/assets/images/bubble_chat.svg";

interface GameHeaderProps {
  initialBalance: number
}

const GameHeader: React.FC<GameHeaderProps> = () => {
  const { isConnected, balance, currency } = useGameSocket()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    console.log("GameHeader Mounted")
    console.log("WebSocket Connection Status:", isConnected)

    // check if mobile on mount and when window resizes
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [isConnected])

  return (
    <div className="w-full bg-gray-800/80 py-3 px-4 sm:px-6 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Turbo Dice + How to Play */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white whitespace-nowrap">
              Turbo Dice
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="cursor-pointer">
              {isMobile ? (
                <div className="flex items-center gap-1">
                  <Image
                    src={howToPlay || "/placeholder.svg"}
                    alt="How to play"
                    width={24}
                    height={24}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                  <span className="text-xs text-white font-medium hidden xs:inline">How to play?</span>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-medium px-2 sm:px-4 py-1.5 rounded-full flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" />
                  <span>How to play?</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Balance + User + Message */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center text-sm sm:text-md font-semibold text-green-500 whitespace-nowrap">
              <span className="animate-pulse">{balance.toLocaleString()} {currency}</span>              
            </div>
            <div className="h-4 w-[1px] bg-gray-600 hidden xs:block"></div>
            <div className="flex items-center gap-1 sm:gap-2">
              <UserDropdown userImage={user} />

              <div className="cursor-pointer">
                <Image src={chat} alt="chat bubble" width={24} height={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameHeader