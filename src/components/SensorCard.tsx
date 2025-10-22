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
      whileHover={{ scale: 1.05, rotate: 1 }}
      className="flex flex-col items-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-gray-200 min-w-[140px]"
    >
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-gray-700 font-semibold text-center text-sm">{label}</p>
      <div className="flex items-center gap-1">
        <p className="text-2xl font-bold text-green-700">
          {value}
          <span className="text-sm font-medium ml-1">{unit}</span>
        </p>
        {trend && (
          <TrendingUp className={`w-4 h-4 ${
            trend === "up" ? "text-green-500" :
            trend === "down" ? "text-red-500 rotate-180" : "text-gray-400"
          }`} />
        )}
      </div>
    </motion.div>
  );
}
