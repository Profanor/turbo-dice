
"use client"

import { type FC, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useGameSocket } from "@/app/socketService"
import { decryptData, encryptData } from "@/lib/crypto-utils"

interface BetContainerProps {
  autoBet: boolean
  setAutoBet: (value: boolean) => void
  autoBetRounds: number
  setAutoBetRounds: (value: number) => void
  betAmounts: number[]
  selectedBet: number | null
  setSelectedBet: (value: number) => void
  scrollBets: (direction: "left" | "right") => void
  rollDice: () => void
  rolling: boolean
}

const BetContainer: FC<BetContainerProps> = ({
  autoBet,
  setAutoBet,
  autoBetRounds,
  setAutoBetRounds,
  betAmounts,
  selectedBet,
  setSelectedBet,
  rollDice,
  rolling,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || ""
  const cesload = process.env.NEXT_PUBLIC_HASH || ""
  const { isConnected, emitEvent, onEvent } = useGameSocket(clientId, cesload)

  const handleRollDice = () => {
    if (!selectedBet || !isConnected) return

    const payload = {
      stakeAmount: selectedBet,
      instantTournamentId: 630,
    }

    const encryptedPayload = encryptData(payload)
    if (encryptedPayload) {
      encryptedPayload
        .then((payload) => {
          if (payload) {
            emitEvent("play_instant_tournament_game", payload)
            rollDice()
          } else {
            console.error("Failed to encrypt payload")
          }
        })
        .catch((error) => {
          console.error("Encryption error:", error)
        })
    } else {
      console.error("Failed to encrypt payload")
    }
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

  const scrollBets = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = scrollContainerRef.current.clientWidth * 0.5 * (direction === "left" ? -1 : 1)

    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <Card className="w-full sm:w-3/4 bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-4">
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
            Select Bet Amount
          </span>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-300">Auto Bet:</span>
              <button
                onClick={() => setAutoBet(!autoBet)}
                type="button"
                title="Auto Bet"
                className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 ${
                  autoBet ? "bg-sky-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`${autoBet ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="autoBetRounds" className="text-xs text-gray-300">
                Rounds:
              </label>
              <input
                id="autoBetRounds"
                type="number"
                min={1}
                value={autoBetRounds}
                onChange={(e) => setAutoBetRounds(Number(e.target.value))}
                className="bg-amber-50 w-12 p-1 text-xs text-black rounded border border-sky-400/50 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>
          </div>
        </div>

        {/* betting controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* left chevron outside the scroll area */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 bg-gray-800/50 text-sky-400 hover:bg-gray-800/70 z-10"
            onClick={() => scrollBets("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* scrollable bet amounts container */}
          <div className="relative flex-1 overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="flex space-x-2 pb-2 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {betAmounts.map((amount) => (
                <motion.div key={amount} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={selectedBet === amount ? "default" : "outline"}
                    onClick={() => setSelectedBet(amount)}
                    className={`px-3 py-2 text-sm transition-all flex-shrink-0 ${
                      selectedBet === amount
                        ? "bg-sky-600 text-white border border-sky-500"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 opacity-40 hover:opacity-70"
                    }`}
                  >
                    {amount}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* right chevron outside the scroll area */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 bg-gray-800/50 text-sky-400 hover:bg-gray-800/70 z-10"
            onClick={() => scrollBets("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* bet & roll button */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="hidden sm:block flex-shrink-0">
            <Button
              onClick={handleRollDice}
              disabled={!selectedBet || rolling}
              className="w-full sm:w-auto py-2 px-4 text-sm bg-gradient-to-r from-sky-400 to-white hover:from-sky-500 hover:to-sky-100 text-black font-bold transition-all duration-300"
            >
              {rolling ? "Rolling..." : "Bet & Roll"}
            </Button>
          </motion.div>
        </div>
      </div>
    </Card>
  )
}

export default BetContainer