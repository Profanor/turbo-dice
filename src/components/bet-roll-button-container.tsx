"use client"

import { type FC, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useGameSocket } from "@/app/socketService"
import { decryptData, encryptData } from "@/lib/crypto-utils"
import { Card } from "./ui/card"

interface BetButtonContainerProps {
  selectedBet: number | null
  rolling: boolean
  rollDice: () => void
}

const BetButtonContainer: FC<BetButtonContainerProps> = ({ selectedBet, rolling, rollDice }) => {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || ""
  const cesload = process.env.NEXT_PUBLIC_HASH || ""
  const { isConnected, emitEvent, onEvent } = useGameSocket(clientId, cesload)

  const handleRollDice = () => {
    if (!selectedBet || !isConnected) return

    const payload = {
      stakeAmount: selectedBet,
      instantTournamentId: 630,
    }

    encryptData(payload)
      .then((encryptedPayload) => {
        if (encryptedPayload) {
          emitEvent("play_instant_tournament_game", encryptedPayload)
          rollDice()
        } else {
          console.error("Failed to encrypt payload")
        }
      })
      .catch((error) => {
        console.error("Encryption error:", error)
      })
  }

  useEffect(() => {
    console.log("BetContainer Mounted")
    console.log("WebSocket Connection Status:", isConnected)

    onEvent("played_instant_tournament_game", (encryptedData: string) => {
      const decrypted = decryptData(encryptedData)

      if (decrypted) {
        console.log("Game Result:", decrypted)
      } else {
        console.error("Decryption failed: received malformed data")
      }
    })
  }, [isConnected, onEvent])

  return (
    <Card className="w-full bg-gray-800/80 backdrop-blur-sm rounded-lg border-1 border-sky-500/30 shadow-lg shadow-sky-500/10 p-4 h-full">
      <div className="flex flex-col items-center justify-center h-full">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
          <Button
            onClick={handleRollDice}
            disabled={!selectedBet || rolling}
            className="w-full h-full min-h-[70px] py-3 px-4 text-sm bg-gradient-to-r from-sky-400 to-white hover:from-sky-500 hover:to-sky-100 text-black font-bold transition-all duration-300"
          >
            {rolling ? "Rolling..." : "Bet & Roll"}
          </Button>
        </motion.div>
      </div>
    </Card>
  )
}

export default BetButtonContainer