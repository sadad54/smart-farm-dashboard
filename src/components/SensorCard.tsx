import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface Props {
  label: string;
  value: number | string;
  unit?: string;
  icon?: React.ReactNode;
}

export  function SensorCard({ label, value, unit, icon, trend }: {
  label: string;
  value: number | string;
  unit?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "stable";
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center bg-gradient-to-br from-white/95 to-kid-green-50 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-4 border-kid-green-200 min-w-[160px] transform hover:shadow-2xl transition-all duration-300"
    >
      <motion.div 
        className="text-5xl mb-3"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeInOut"
        }}
      >
        {icon}
      </motion.div>
      <p className="text-kid-green-700 font-fredoka font-bold text-center text-base mb-2">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-3xl font-display font-black text-kid-green-600">
          {value}
          <span className="text-lg font-bold ml-1 text-kid-green-500">{unit}</span>
        </p>
        {trend && (
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: trend === "up" ? [0, 10, 0] : trend === "down" ? [0, -10, 0] : [0, 0, 0]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <TrendingUp className={`w-5 h-5 ${
              trend === "up" ? "text-kid-green-500" :
              trend === "down" ? "text-kid-orange-500 rotate-180" : "text-kid-blue-400"
            }`} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
