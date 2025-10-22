import { AnimatePresence, motion } from "framer-motion";

interface AnimalDetectorProps {
  detected: boolean;
}

export function AnimalDetector({ detected }: AnimalDetectorProps) {
  return (
    <AnimatePresence>
      {detected && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-br from-kid-yellow-100 to-kid-orange-100 rounded-3xl shadow-2xl p-10 border-4 border-kid-yellow-400"
        >
          <div className="text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-9xl mb-6"
            >
              🐔
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-kid-orange-800 mb-3">Animal Detected! 🎉</h2>
            <p className="text-kid-orange-700 font-fredoka text-xl">A chicken is visiting the farm! 🐾</p>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-4 text-2xl"
            >
              🌟
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}