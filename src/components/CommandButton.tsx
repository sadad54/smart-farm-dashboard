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
      className={`flex items-center justify-center gap-2 px-6 py-3 text-white rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600`}
      whileHover={{ scale: isDisabled ? 1 : 1.05 }}
      whileTap={{ scale: isDisabled ? 1 : 0.95 }}
    >
      <span className="text-2xl">{icon}</span>
      {isDisabled ? `Wait ${cd}s...` : label}
    </motion.button>
  );
}