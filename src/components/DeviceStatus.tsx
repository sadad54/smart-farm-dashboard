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
      <span className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 shadow-lg ${
        isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600 animate-pulse"
      }`}>
        <span className={`block w-2.5 h-2.5 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></span>
        {isOnline ? "Farm Online" : "Connecting..."}
      </span>
    </motion.div>
  );
}
