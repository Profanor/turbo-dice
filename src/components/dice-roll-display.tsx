"use client";

import type { FC } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const bg = "/assets/images/desktop.png"; // desktop image
const mobile = "/assets/images/mobile.png"; // mobile image

interface DiceRollDisplayProps {
  rolling: boolean;
  result: number | null;
}

export const DiceRollDisplay: FC<DiceRollDisplayProps> = ({ rolling, result }) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    const updateBackground = () => {
      const newBg = window.innerWidth < 768 ? mobile : bg;
      setBackgroundImage(newBg);
    };

    updateBackground();
    window.addEventListener("resize", updateBackground);
    return () => window.removeEventListener("resize", updateBackground);
  }, []);

  if (!backgroundImage) return null; // prevents rendering before background is set

  return (
    <Card className="relative w-full h-[250px] sm:h-[400px] md:h-[450px] lg:h-[500px] bg-[#1E1E1E] backdrop-blur-sm rounded-lg border-1 border-[#00A6F44D] overflow-hidden">
      {/* background image */}
      <Image
        key={backgroundImage}
        src={backgroundImage}
        alt="Background Image"
        fill
        className="object-cover"
        priority
      />

      {/* content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center h-full z-10">
        <AnimatePresence mode="wait">
          {rolling ? (
            <motion.div
              key="rolling"
              animate={{ rotate: 360 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5 }}
              className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl"
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
              <span className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl mb-2 sm:mb-6">🎲</span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
              >
                Score: {result}
              </motion.span>
            </motion.div>
          ) : (
            <span className="text-sm sm:text-2xl md:text-3xl text-gray-400 font-semibold text-center px-4">
              Place your bet & roll!
            </span>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
