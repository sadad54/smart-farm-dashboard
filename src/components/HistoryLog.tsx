import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface LogItem {
  icon: string;
  text: string;
  time: string;
}

interface HistoryLogProps {
  title: string;
  logs: LogItem[];
  icon: React.ReactNode;
}

export function HistoryLog({ title, logs, icon }: HistoryLogProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white/90 rounded-3xl shadow-xl p-6 border-4 border-kid-blue-200"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-2xl"
        >
          {icon}
        </motion.div>
        <h3 className="font-fredoka font-bold text-kid-blue-800 text-lg">
          {title}
        </h3>
      </div>
      <ul className="space-y-2 h-32 overflow-y-auto pr-2">
        {logs.length === 0 ? (
          <li className="text-sm text-gray-400">No events yet.</li>
        ) : (
          logs.map((log, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 text-sm text-gray-800"
            >
              <span className="text-lg">{log.icon}</span>
              <span>{log.text}</span>
              <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {log.time}
              </span>
            </motion.li>
          ))
        )}
      </ul>
    </motion.div>
  );
}