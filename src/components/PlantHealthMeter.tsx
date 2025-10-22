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
        healthColor === "green" ? "from-green-100 to-emerald-100 border-green-300" :
        healthColor === "yellow" ? "from-yellow-100 to-amber-100 border-yellow-300" :
        "from-red-100 to-rose-100 border-red-300"
      } rounded-2xl shadow-lg p-4 border-2`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Plant Health
        </h3>
        <span className="text-3xl">{healthEmoji}</span>
      </div>
      <div className="relative h-4 bg-white/50 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${health}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${
            healthColor === "green" ? "bg-green-500" :
            healthColor === "yellow" ? "bg-yellow-500" : "bg-red-500"
          }`}
        />
      </div>
      <p className="text-sm font-medium text-gray-700">Health Score: {health.toFixed(0)}%</p>
    </motion.div>
  );
}
