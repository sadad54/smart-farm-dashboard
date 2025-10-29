// src/components/StartScreen.tsx
"use client";
import Image from "next/image";
import { motion } from "framer-motion";

type StartScreenProps = {
  onEnter?: () => void;
};

export function StartScreen({ onEnter }: StartScreenProps) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background image — full, positioned behind */}
      <div className="absolute inset-0 -z-10">
        <Image
          // *** PLACEHOLDER: Update with your background asset path ***
          src="/assets/backgrounds/Asset-18@4x.png"
          alt="Start screen background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Start Button centered in screen */}
<div className="absolute z-20 bottom-[10%] right-[12%] md:bottom-[0.75%] md:right-[10%]">
  <motion.button
    onClick={onEnter}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      delay: 0.3,
      duration: 0.7,
      type: "spring",
      stiffness: 120,
    }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <div className="relative w-60 h-60 md:w-60 md:h-60">
      <Image
        src="/assets/buttons/Asset-17@4x.png"
        alt="Start"
        fill
        className="object-contain object-center drop-shadow-xl"
      />
    </div>
  </motion.button>
</div>

    </div>
  );
}