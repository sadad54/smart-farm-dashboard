import { motion } from "framer-motion";

// src/components/AICoach.tsx
export function AICoach({ soil, temp, hum, light }: {
  soil?: number; temp?: number; hum?: number; light?: number;
}) {
  const messages: string[] = [];
  if (soil && soil > 2500) messages.push("The soil looks dry. Let's give our plant a drink! 💧");
  if (temp && temp > 30) messages.push("It's getting warm. Try running the fan! 🌬️");
  if (light && light < 500) messages.push("It's a bit dark. The plant might like the grow light! 💡");

  const tip = messages[0] ?? "Everything looks great! What a happy plant. 🪴";

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full bg-gradient-to-r from-kid-purple-100 to-kid-pink-100 border-4 border-kid-purple-300 rounded-3xl p-6 text-kid-purple-900 shadow-xl transform hover:scale-105 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-4xl"
        >
          🤖
        </motion.div>
        <div className="flex-1">
          <span className="font-fredoka font-bold text-xl text-kid-purple-800">AI Coach says:</span>
          <motion.p 
            className="mt-2 font-fredoka text-lg text-kid-purple-700"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {tip}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
