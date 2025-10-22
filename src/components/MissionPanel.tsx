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
      className="w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 border-2 border-green-300"
    >
      <div className="text-xl font-bold mb-3 text-green-800 flex items-center gap-2">
        🎯 Mission: Help the Thirsty Plant!
        {step === "done" && <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />}
      </div>
      <div className="h-3 w-full bg-gray-200 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg"
          initial={{ width: '0%' }}
          animate={{ width: getProgressWidth() }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-gray-700 text-md font-medium"
      >
        {step === "sense" && "Step 1: 🔍 Checking the sensors to see if the plant is thirsty..."}
        {step === "act" && "Step 2: 💧 The soil is dry! Press the 'Water Plant' button below."}
        {step === "reflect" && "Step 3: 📈 Great job! Watch the soil moisture chart go up!"}
        {step === "done" && "✅ Mission Complete! You've earned the Junior Grower badge! 🌱"}
      </motion.div>
    </motion.div>
  );
}
