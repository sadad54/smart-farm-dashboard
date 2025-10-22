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
      className="w-full bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-2xl p-4 text-purple-900 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-3xl"
        >
          🤖
        </motion.div>
        <div>
          <span className="font-bold text-lg">AI Coach says:</span>
          <p className="mt-1">{tip}</p>
        </div>
      </div>
    </motion.div>
  );
}
