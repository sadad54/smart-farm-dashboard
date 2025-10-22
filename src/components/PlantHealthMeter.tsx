import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function PlantHealthMeter({ readings }: { readings: Record<string, number> }) {
  const soil = readings["soil"] ?? 3000;
  const temp = readings["temp"] ?? 25;
  const light = readings["light"] ?? 800;
  
  // Calculate health score (0-100)
  let health = 100;
  if (soil > 3000) health -= 30; // Too dry
  if (soil < 1000) health -= 20; // Too wet
  if (temp > 32) health -= 20; // Too hot
  if (temp < 18) health -= 15; // Too cold
  if (light < 300) health -= 15; // Too dark
  
  health = Math.max(0, Math.min(100, health));
  
  const healthColor = health > 70 ? "green" : health > 40 ? "yellow" : "red";
  const healthEmoji = health > 70 ? "🌿" : health > 40 ? "🍃" : "🥀";
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${
        healthColor === "green" ? "from-kid-green-100 to-kid-green-200 border-kid-green-300" :
        healthColor === "yellow" ? "from-kid-yellow-100 to-kid-yellow-200 border-kid-yellow-300" :
        "from-kid-orange-100 to-kid-orange-200 border-kid-orange-300"
      } rounded-3xl shadow-xl p-6 border-4 transform hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-fredoka font-bold text-lg flex items-center gap-2">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles className="w-6 h-6 text-kid-green-600" />
          </motion.div>
          <span className={`${
            healthColor === "green" ? "text-kid-green-800" :
            healthColor === "yellow" ? "text-kid-yellow-800" : "text-kid-orange-800"
          }`}>
            Plant Health
          </span>
        </h3>
        <motion.span 
          className="text-4xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          {healthEmoji}
        </motion.span>
      </div>
      <div className="relative h-6 bg-white/70 rounded-full overflow-hidden mb-3 border-2 border-white/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${health}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${
            healthColor === "green" ? "bg-gradient-to-r from-kid-green-400 to-kid-green-500" :
            healthColor === "yellow" ? "bg-gradient-to-r from-kid-yellow-400 to-kid-yellow-500" : 
            "bg-gradient-to-r from-kid-orange-400 to-kid-orange-500"
          }`}
        />
      </div>
      <p className={`text-lg font-fredoka font-bold ${
        healthColor === "green" ? "text-kid-green-700" :
        healthColor === "yellow" ? "text-kid-yellow-700" : "text-kid-orange-700"
      }`}>
        Health Score: {health.toFixed(0)}% {health > 70 ? "🌟" : health > 40 ? "👍" : "💪"}
      </p>
    </motion.div>
  );
}
