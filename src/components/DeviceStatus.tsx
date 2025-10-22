// src/components/DeviceStatus.tsx
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";export function DeviceStatus({ lastTs }: { lastTs: number | undefined }) {
  const isOnline = lastTs && (Date.now() - lastTs < 10000);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 right-4 z-10"
    >
      <motion.span 
        className={`px-6 py-3 text-base font-fredoka font-bold rounded-full flex items-center gap-3 shadow-xl border-2 ${
          isOnline ? "bg-gradient-to-r from-kid-green-100 to-kid-green-200 text-kid-green-800 border-kid-green-300" : "bg-gradient-to-r from-kid-orange-100 to-kid-orange-200 text-kid-orange-800 border-kid-orange-300 animate-pulse"
        }`}
        animate={isOnline ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <motion.span 
          className={`block w-3 h-3 rounded-full ${isOnline ? "bg-kid-green-500" : "bg-kid-orange-500"}`}
          animate={isOnline ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
        ></motion.span>
        <span className="flex items-center gap-2">
          {isOnline ? "🟢 Farm Online!" : "🔄 Connecting..."}
        </span>
      </motion.span>
    </motion.div>
  );
}
