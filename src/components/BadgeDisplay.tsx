import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
export function BadgeDisplay({ badges }: { badges: string[] }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl shadow-lg p-4 border-2 border-yellow-300"
    >
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-5 h-5 text-yellow-600" />
        <h3 className="font-bold text-yellow-800">Your Badges</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {badges.length === 0 ? (
          <p className="text-sm text-yellow-700">Complete missions to earn badges!</p>
        ) : (
          badges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="px-3 py-1.5 bg-white rounded-full text-sm font-medium shadow-sm"
            >
              {badge}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
