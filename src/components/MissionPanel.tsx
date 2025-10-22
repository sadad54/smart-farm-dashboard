// src/components/MissionPanel.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Step = "sense" | "act" | "reflect" | "done";

export function MissionPanel({ readings }: { readings: Record<string, number> }) {
  const [step, setStep] = useState<Step>("sense");
  const isDry = readings["soil"] !== undefined && readings["soil"] > 2500; // Adjust this threshold

  useEffect(() => {
    // Automatically move to the 'act' step once the sensor confirms it's dry
    if (step === "sense" && isDry) {
      setTimeout(() => setStep("act"), 1000);
    }
  }, [isDry, step]);
  
  // This is a placeholder to move the mission forward after acting.
  // In a real scenario, you'd trigger this after the "Water Plant" button is clicked.
  useEffect(() => {
    const handleAction = () => {
      if (step === 'act') {
        setStep('reflect');
        setTimeout(() => setStep('done'), 4000); // Wait for the effect
      }
    };
    window.addEventListener('plant-watered', handleAction);
    return () => window.removeEventListener('plant-watered', handleAction);
  }, [step]);


  const getProgressWidth = () => {
    if (step === "sense") return "33%";
    if (step === "act") return "66%";
    return "100%";
  };

  return (
    <div className="w-11/12 md:w-2/3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 border border-gray-200">
      <div className="text-xl font-bold mb-3 text-green-800">🎯 Mission: Help the Thirsty Plant!</div>
      <div className="h-2.5 w-full bg-gray-200 rounded-full mb-4">
        <motion.div 
          className="h-2.5 rounded-full bg-green-500"
          initial={{ width: '0%' }}
          animate={{ width: getProgressWidth() }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      <div className="text-gray-700 text-md">
        {step === "sense" && "Step 1: Checking the sensors to see if the plant is thirsty..."}
        {step === "act" && "Step 2: The soil is dry! Press the '💧 Water Plant' button below."}
        {step === "reflect" && "Step 3: Great job! Now, watch the soil moisture chart go up as the plant drinks."}
        {step === "done" && "✅ Mission Complete! You've earned the Junior Grower badge! 🌱"}
      </div>
    </div>
  );
}