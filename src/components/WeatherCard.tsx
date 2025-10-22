import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Sun, Thermometer, Wind, Sparkles, Trophy, Book, TrendingUp, AlertTriangle, CloudRain, Bird } from "lucide-react";
export function WeatherCard({ readings }: { readings: Record<string, number> }) {
  const temp = readings["temp"] ?? 25;
  const rain = readings["rain"] ?? 0;
  const light = readings["light"] ?? 800;
  
  const weather = rain > 2000 ? "rainy" : light < 500 ? "cloudy" : temp > 28 ? "sunny-hot" : "sunny";
  const weatherEmoji = weather === "rainy" ? "🌧️" : weather === "cloudy" ? "☁️" : weather === "sunny-hot" ? "🌞" : "☀️";
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl shadow-lg p-4 border border-blue-200"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-blue-900 flex items-center gap-2">
          <CloudRain className="w-5 h-5" />
          Farm Weather
        </h3>
        <span className="text-4xl">{weatherEmoji}</span>
      </div>
      <div className="space-y-1 text-sm text-blue-800">
        <p>Temperature: {temp.toFixed(1)}°C</p>
        <p>Conditions: {weather === "rainy" ? "Rainy" : weather === "cloudy" ? "Cloudy" : "Sunny"}</p>
        {rain > 2000 && <p className="text-blue-600 font-medium">🌧️ It's raining! Plants are happy!</p>}
      </div>
    </motion.div>
  );
}
