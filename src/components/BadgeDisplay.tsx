import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
export function BadgeDisplay({ badges }: { badges: string[] }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="bg-gradient-to-br from-kid-yellow-100 to-kid-orange-100 rounded-3xl shadow-xl p-6 border-4 border-kid-yellow-300 transform hover:scale-105 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Trophy className="w-7 h-7 text-kid-yellow-600" />
        </motion.div>
        <h3 className="font-fredoka font-bold text-kid-yellow-800 text-xl">Your Badges</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {badges.length === 0 ? (
          <div className="text-center w-full">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl mb-2"
            >
              🏆
            </motion.div>
            <p className="text-kid-yellow-700 font-fredoka text-lg">Complete missions to earn badges! 🌟</p>
          </div>
        ) : (
          badges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="px-4 py-2 bg-gradient-to-r from-white to-kid-yellow-50 rounded-full text-base font-fredoka font-bold shadow-lg border-2 border-kid-yellow-200"
            >
              {badge}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
