// src/components/CommandButton.tsx
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  label: string;
  command: object;
  icon: string;
  className?: string;
  cooldownSeconds?: number;
}

export function CommandButton({ label, icon, onClick, cooldown = 5 }: {
  label: string;
  icon: string;
  onClick: () => void;
  cooldown?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [cd, setCd] = useState(0);

  useEffect(() => {
    if (cd <= 0) return;
    const timer = setTimeout(() => setCd(cd - 1), 1000);
    return () => clearTimeout(timer);
  }, [cd]);

  const handleClick = async () => {
    if (cd > 0) return;
    setLoading(true);
    await onClick();
    setLoading(false);
    setCd(cooldown);
  };

  const isDisabled = loading || cd > 0;

  return (
    <motion.button
      disabled={isDisabled}
      onClick={handleClick}
      className={`flex items-center justify-center gap-3 px-8 py-4 text-white rounded-3xl font-fredoka font-bold text-xl shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed border-4 ${
        isDisabled 
          ? "bg-gradient-to-r from-gray-400 to-gray-500 border-gray-300" 
          : "bg-gradient-to-r from-kid-green-400 to-kid-blue-400 hover:from-kid-green-500 hover:to-kid-blue-500 border-kid-yellow-300 hover:border-kid-yellow-400"
      }`}
      whileHover={{ scale: isDisabled ? 1 : 1.1, rotate: isDisabled ? 0 : 2 }}
      whileTap={{ scale: isDisabled ? 1 : 0.9 }}
    >
      <motion.span 
        className="text-3xl"
        animate={!isDisabled ? { 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {icon}
      </motion.span>
      <span className="font-fredoka">
        {isDisabled ? `Wait ${cd}s...` : label}
      </span>
    </motion.button>
  );
}