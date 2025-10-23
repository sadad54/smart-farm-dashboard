import { motion } from "framer-motion";
import { Sun } from "lucide-react";
import { useState } from "react";

export function LightControl() {
  const [brightness, setBrightness] = useState(50);

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white/90 rounded-3xl shadow-xl p-6 border-4 border-kid-yellow-200"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="text-2xl text-kid-yellow-500"
        >
          <Sun />
        </motion.div>
        <h3 className="font-fredoka font-bold text-kid-yellow-800 text-lg">
          Grow Light Control
        </h3>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="0"
          max="100"
          value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
          className="w-full h-3 bg-kid-yellow-200 rounded-full appearance-none cursor-pointer"
        />
        <span className="font-bold text-kid-yellow-700">{brightness}%</span>
      </div>
      <p className="text-center mt-4 font-fredoka text-kid-yellow-600 text-sm">
        Adjust the brightness to help your plant grow!
      </p>
    </motion.div>
  );
}