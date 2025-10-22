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
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl shadow-2xl p-8 border-4 border-yellow-400"
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-8xl mb-4"
            >
              🐔
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Animal Detected!</h2>
            <p className="text-gray-600">A chicken is visiting the farm!</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}