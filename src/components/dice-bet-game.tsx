"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Trophy, DollarSign, Clock } from "lucide-react"

const betAmounts = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000]

export default function DiceBetGame() {
  const [selectedBet, setSelectedBet] = useState<number | null>(null)
  const [rolling, setRolling] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [recentResults, setRecentResults] = useState<number[]>([])
  const [leaderboard, setLeaderboard] = useState<
    {
      name: string
      score: number
      position: number
      status: "active" | "win" | "loss"
    }[]
  >([])
  const [autoBet, setAutoBet] = useState(false)
  const [autoBetRounds, setAutoBetRounds] = useState(1)
  const [timer, setTimer] = useState(10)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const autoBetCountRef = useRef(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const rollDice = () => {
    if (!selectedBet) 
        return
    setRolling(true)
    setResult(null) // clear the previous result immediately

    // start the timer when rolling
    if (!isTimerRunning) {
      startTimer()
    }

    setTimeout(() => {
      const finalResult = Math.floor(Math.random() * 6) + 1
      setResult(finalResult)
      setRecentResults((prev) => {
        const updated = [finalResult, ...prev]
        return updated.slice(0, 8)
      })

      // add player to leaderboard
      const newPosition = leaderboard.length + 1
      setLeaderboard((prev) => [
        ...prev,
        {
          name: `User${prev.length + 1}`,
          score: finalResult,
          position: newPosition,
          status: "active",
        },
      ])
      setRolling(false)

      // hide the result after 1 second
      setTimeout(() => setResult(null), 1000)
    }, 1000)
  }

  const startTimer = () => {
    setIsTimerRunning(true)
    setTimer(10) // reset to default

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          // timer finished
          clearInterval(timerRef.current as NodeJS.Timeout)
          setIsTimerRunning(false)
          endGame()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }

  const endGame = () => {
    // update leaderboard statuses
    setLeaderboard((prev) =>
      prev.map((player) => {
        // determine win/loss based on score for now scores > 3 are wins
        const isWin = player.score > 3
        return {
          ...player,
          status: isWin ? "win" : "loss",
        }
      }),
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    if (autoBet) {
      autoBetCountRef.current = 0
    }
  }, [autoBet])

  useEffect(() => {
    if (!rolling && result !== null && autoBet) {
      autoBetCountRef.current += 1
      if (autoBetCountRef.current < autoBetRounds) {
        rollDice()
      } else {
        setAutoBet(false)
      }
    }
  }, [rolling, result, autoBet, autoBetRounds]) // Removed rollDice from dependencies

  useEffect(() => {
    // cleanup timer on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const scrollBets = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200 * (direction === "left" ? -1 : 1)
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollLeft + scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center py-4">
      <div className="w-full max-w-5xl px-4">
        <div className="w-full flex justify-between items-center px-4 mb-4">
          <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
            Dice Aviator
          </div>
          <div className="flex items-center text-md font-semibold text-green-500">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className="animate-pulse">3000.00 USD</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            <Card className="w-full bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 py-2 px-4">
              <div className="flex items-center space-x-4 overflow-x-auto">
                {recentResults.map((res, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="px-3 py-1 rounded-full bg-gray-700 text-yellow-400 font-bold"
                  >
                    {res}
                  </motion.div>
                ))}
                {recentResults.length === 0 && (
                  <span className="text-gray-400 text-sm italic">No recent rolls yet...</span>
                )}
              </div>
            </Card>

            <Card className="relative w-full bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 py-8 px-4">
              <div className="flex flex-col items-center justify-center min-h-[150px]">
                <AnimatePresence mode="wait">
                  {rolling ? (
                    <motion.div
                      key="rolling"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5 }}
                      className="text-6xl"
                    >
                      🎲
                    </motion.div>
                  ) : result !== null ? (
                    <motion.div
                      key="result"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-6xl mb-2">🎲</span>
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
                      >
                        Score: {result}
                      </motion.span>
                    </motion.div>
                  ) : (
                    <span className="text-xl text-gray-400 font-semibold">Place your bet & roll!</span>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            <Card className="w-full bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 py-2 px-4">
              <div className="flex flex-col items-center">
                <span className="text-sm mb-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
                  Select Bet Amount
                </span>
                <div className="relative w-full overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-transparent text-sky-400 hover:bg-gray-800/30"
                    onClick={() => scrollBets("left")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div
                    ref={scrollContainerRef}
                    className="flex space-x-2 pb-2 px-8 overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {betAmounts.map((amount) => (
                      <motion.div key={amount} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={selectedBet === amount ? "default" : "outline"}
                          onClick={() => setSelectedBet(amount)}
                          className={`px-3 py-2 text-sm transition-all flex-shrink-0 ${
                            selectedBet === amount
                              ? `bg-sky-600 text-white border border-sky-500`
                              : `bg-gray-800 text-gray-400 hover:bg-gray-700 opacity-40 hover:opacity-70`
                          }`}
                        >
                          {amount}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-transparent text-sky-400 hover:bg-gray-800/30"
                    onClick={() => scrollBets("right")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-2">
                <div className="flex items-center justify-center h-full">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
                    <Button
                      onClick={rollDice}
                      disabled={!selectedBet || rolling}
                      className="w-full py-2 text-sm bg-gradient-to-r from-sky-400 to-white hover:from-sky-500 hover:to-sky-100 text-black font-bold transition-all duration-300"
                    >
                      {rolling ? "Rolling..." : "Bet & Roll"}
                    </Button>
                  </motion.div>
                </div>
              </Card>

              <Card className="bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-2">
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-xs mb-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
                    Auto Bet
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setAutoBet(!autoBet)}
                        title="button"
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 ${
                          autoBet ? "bg-sky-500" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`${
                            autoBet ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </button>
                      <label className="text-xs text-gray-200">{autoBet ? "On" : "Off"}</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label htmlFor="autoBetRounds" className="text-xs text-gray-200">
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
              </Card>

              <Card className="bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-2">
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-xs mb-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Game Timer
                  </span>
                  <div className="flex flex-col items-center">
                    <div className={`text-xl font-bold ${timer <= 5 ? "text-red-500 animate-pulse" : "text-sky-400"}`}>
                      {formatTime(timer)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {isTimerRunning ? "Game in progress" : "Waiting to start"}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Card className="w-full lg:w-1/3 bg-gray-800/80 backdrop-blur-sm rounded-lg border-2 border-sky-500/30 shadow-lg shadow-sky-500/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Leaderboard
                </h2>
              </div>
              <div className="text-xs font-medium text-sky-400 bg-sky-400/10 px-2 py-1 rounded-full">
                Players: {leaderboard.length}
              </div>
            </div>

            {/* Leaderboard header */}
            <div className="grid grid-cols-3 gap-2 mb-2 text-xs text-gray-400 font-semibold border-b border-gray-700 pb-2">
              <div>Position</div>
              <div>Player</div>
              <div>Score</div>
            </div>

            {leaderboard.slice(-5).map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`grid grid-cols-3 gap-2 py-2 px-3 mb-2 rounded-md ${
                  entry.status === "win"
                    ? "bg-green-500/20 border border-green-500/50"
                    : entry.status === "loss"
                      ? "bg-red-500/20 border border-red-500/50"
                      : index === 0
                        ? "bg-yellow-500/20 border border-yellow-500/50"
                        : index === 1
                          ? "bg-gray-400/20 border border-gray-400/50"
                          : index === 2
                            ? "bg-amber-700/20 border border-amber-700/50"
                            : "bg-gray-700/50"
                }`}
              >
                <div className="flex items-center">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-700 text-xs mr-2">
                    {entry.position}
                  </span>
                </div>
                <div className="truncate">{entry.name}</div>
                <div
                  className={`font-bold ${
                    entry.status === "win"
                      ? "text-green-500"
                      : entry.status === "loss"
                        ? "text-red-500"
                        : "text-yellow-400"
                  }`}
                >
                  {entry.score}
                </div>
              </motion.div>
            ))}

            {leaderboard.length === 0 && (
              <div className="text-gray-400 text-sm italic py-2 text-center">No players yet</div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-700 text-center">
              <span className="text-xs text-gray-400">This game is powered by</span>
              <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
                Smatvirtual
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

