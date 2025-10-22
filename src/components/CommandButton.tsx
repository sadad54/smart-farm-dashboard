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

export function CommandButton({ label, command, icon, className, cooldownSeconds = 5 }: Props) {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown(cooldown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleClick() {
    if (cooldown > 0) return;
    setLoading(true);
    
    // For the MissionPanel
    if (label.includes("Water")) {
      window.dispatchEvent(new Event('plant-watered'));
    }

    await fetch("/api/issue-command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        device_id: process.env.NEXT_PUBLIC_DEVICE_ID,
        command
      })
    });
    
    setLoading(false);
    setCooldown(cooldownSeconds);
  }

  const isDisabled = loading || cooldown > 0;

  return (
    <motion.button
      disabled={isDisabled}
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 px-6 py-3 text-white rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      whileHover={{ scale: isDisabled ? 1 : 1.05 }}
      whileTap={{ scale: isDisabled ? 1 : 0.95 }}
    >
      {icon} 
      {isDisabled ? `Wait ${cooldown}s...` : label}
    </motion.button>
  );
}