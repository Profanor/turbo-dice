"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function Home() {
  const [isRotating, setIsRotating] = useState(false)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  // Auto-rotate the dice periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRotating(true)

      // Random rotation values
      const newX = Math.floor(Math.random() * 4) * 90
      const newY = Math.floor(Math.random() * 4) * 90

      setRotateX(newX)
      setRotateY(newY)

      // Stop rotating after animation completes
      setTimeout(() => {
        setIsRotating(false)
      }, 1500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Handle dice click for manual rotation
  const handleDiceClick = () => {
    if (!isRotating) {
      setIsRotating(true)

      // Random rotation values
      const newX = Math.floor(Math.random() * 4) * 90
      const newY = Math.floor(Math.random() * 4) * 90

      setRotateX(newX)
      setRotateY(newY)

      // Stop rotating after animation completes
      setTimeout(() => {
        setIsRotating(false)
      }, 1500)
    }
  }

  return (
    <main className="bg-black flex min-h-screen flex-col items-center justify-center p-4 md:p-24 overflow-hidden">
      <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-12 z-10">
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white text-center md:text-left">
            Welcome to Dice Aviator
          </h1>
          <p className="text-gray-400 mb-8 text-center md:text-left max-w-md">
            Test your luck with our exciting dice game. Place your bets, roll the dice, and win big!
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/game"
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-md hover:from-sky-600 hover:to-sky-700 transition-all duration-300 font-bold text-lg shadow-lg shadow-sky-500/20"
            >
              Play Now
            </Link>
          </motion.div>
        </div>

        {/* 3D Dice */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="perspective-[1000px] w-64 h-64 cursor-pointer" onClick={handleDiceClick}>
            <motion.div
              className="relative w-full h-full transform-style-3d"
              animate={{
                rotateX: rotateX,
                rotateY: rotateY,
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front Face - 1 */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-600 border-4 border-white/20 rounded-2xl shadow-xl flex items-center justify-center transform translate-z-[32px] backface-hidden"
                style={{ transform: "translateZ(32px)", backfaceVisibility: "hidden" }}
              >
                <div className="text-[100px]">🎲</div>
              </div>

              {/* Back Face - 6 */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-600 border-4 border-white/20 rounded-2xl shadow-xl flex items-center justify-center transform rotate-y-180 translate-z-[32px] backface-hidden"
                style={{ transform: "rotateY(180deg) translateZ(32px)", backfaceVisibility: "hidden" }}
              >
                <div className="text-[100px]">🎲</div>
              </div>

              {/* Right Face - 3 */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-sky-500 to-sky-700 border-4 border-white/20 rounded-2xl shadow-xl flex items-center justify-center transform rotate-y-90 translate-z-[32px] backface-hidden"
                style={{ transform: "rotateY(90deg) translateZ(32px)", backfaceVisibility: "hidden" }}
              >
                <div className="text-[100px]">🎲</div>
              </div>

              {/* Left Face - 4 */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-sky-500 to-sky-700 border-4 border-white/20 rounded-2xl shadow-xl flex items-center justify-center transform rotate-y-[-90deg] translate-z-[32px] backface-hidden"
                style={{ transform: "rotateY(-90deg) translateZ(32px)", backfaceVisibility: "hidden" }}
              >
                <div className="text-[100px]">🎲</div>
              </div>

              {/* Top Face - 2 */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-600 border-4 border-white/20 rounded-2xl shadow-xl flex items-center justify-center transform rotate-x-90 translate-z-[32px] backface-hidden"
                style={{ transform: "rotateX(90deg) translateZ(32px)", backfaceVisibility: "hidden" }}
              >
                <div className="text-[100px]">🎲</div>
              </div>

              {/* Bottom Face - 5 */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-600 border-4 border-white/20 rounded-2xl shadow-xl flex items-center justify-center transform rotate-x-[-90deg] translate-z-[32px] backface-hidden"
                style={{ transform: "rotateX(-90deg) translateZ(32px)", backfaceVisibility: "hidden" }}
              >
                <div className="text-[100px]">🎲</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating dice background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-sky-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-sky-400/10 rounded-full filter blur-3xl"></div>

        {/* Floating dice emojis */}
        <motion.div
          className="absolute text-4xl"
          initial={{ x: "10%", y: "10%", opacity: 0.3 }}
          animate={{
            x: "15%",
            y: "15%",
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          🎲
        </motion.div>

        <motion.div
          className="absolute text-5xl"
          initial={{ x: "70%", y: "20%", opacity: 0.2 }}
          animate={{
            x: "75%",
            y: "25%",
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          🎲
        </motion.div>

        <motion.div
          className="absolute text-3xl"
          initial={{ x: "30%", y: "80%", opacity: 0.3 }}
          animate={{
            x: "35%",
            y: "75%",
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          🎲
        </motion.div>

        <motion.div
          className="absolute text-6xl"
          initial={{ x: "80%", y: "70%", opacity: 0.2 }}
          animate={{
            x: "75%",
            y: "65%",
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 11,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          🎲
        </motion.div>
      </div>

      <div className="absolute bottom-4 text-center text-xs text-gray-500">Click the dice to roll it!</div>
    </main>
  )
}
