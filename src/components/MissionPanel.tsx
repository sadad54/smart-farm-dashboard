// src/components/MissionPanel.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

type Step = "sense" | "act" | "reflect" | "done";

export function MissionPanel({ readings, onComplete }: {
  readings: Record<string, number>;
  onComplete: (badge: string) => void;
}) {
  const [step, setStep] = useState<Step>("sense");
  const isDry = readings["soil"] !== undefined && readings["soil"] > 2500;

  useEffect(() => {
    if (step === "sense" && isDry) {
      setTimeout(() => setStep("act"), 1000);
    }
  }, [isDry, step]);

  useEffect(() => {
    const handleAction = () => {
      if (step === 'act') {
        setStep('reflect');
        setTimeout(() => {
          setStep('done');
          onComplete("🌱 Junior Grower");
        }, 4000);
      }
    };
    window.addEventListener('plant-watered', handleAction);
    return () => window.removeEventListener('plant-watered', handleAction);
  }, [step, onComplete]);

  const getProgressWidth = () => {
    if (step === "sense") return "33%";
    if (step === "act") return "66%";
    return "100%";
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full bg-gradient-to-br from-white/95 to-kid-green-50 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-4 border-kid-green-300 transform hover:scale-105 transition-all duration-300"
    >
      <div className="text-2xl font-fredoka font-bold mb-4 text-kid-green-800 flex items-center gap-3">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-3xl"
        >
          🎯
        </motion.div>
        Mission: Help the Thirsty Plant!
        {step === "done" && (
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 360]
            }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <Sparkles className="w-8 h-8 text-kid-yellow-500" />
          </motion.div>
        )}
      </div>
      <div className="h-4 w-full bg-kid-green-200 rounded-full mb-6 overflow-hidden border-2 border-kid-green-300">
        <motion.div
          className="h-full bg-gradient-to-r from-kid-green-400 to-kid-green-500 shadow-lg"
          initial={{ width: '0%' }}
          animate={{ width: getProgressWidth() }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-kid-green-700 text-lg font-fredoka font-semibold"
      >
        {step === "sense" && "Step 1: 🔍 Checking the sensors to see if the plant is thirsty..."}
        {step === "act" && "Step 2: 💧 The soil is dry! Press the 'Water Plant' button below."}
        {step === "reflect" && "Step 3: 📈 Great job! Watch the soil moisture chart go up!"}
        {step === "done" && "✅ Mission Complete! You've earned the Junior Grower badge! 🌱"}
      </motion.div>
    </motion.div>
  );
}
