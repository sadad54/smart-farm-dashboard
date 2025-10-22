import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {  CloudRain } from "lucide-react";
export function WeatherCard({ readings }: { readings: Record<string, number> }) {
  const temp = readings["temp"] ?? 25;
  const rain = readings["rain"] ?? 0;
  const light = readings["light"] ?? 800;
  
  const weather = rain > 2000 ? "rainy" : light < 500 ? "cloudy" : temp > 28 ? "sunny-hot" : "sunny";
  const weatherEmoji = weather === "rainy" ? "🌧️" : weather === "cloudy" ? "☁️" : weather === "sunny-hot" ? "🌞" : "☀️";
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-br from-kid-blue-100 to-kid-blue-200 rounded-3xl shadow-xl p-6 border-4 border-kid-blue-300 transform hover:scale-105 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-fredoka font-bold text-kid-blue-800 text-lg flex items-center gap-2">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <CloudRain className="w-6 h-6" />
          </motion.div>
          Farm Weather
        </h3>
        <motion.span 
          className="text-5xl"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          {weatherEmoji}
        </motion.span>
      </div>
      <div className="space-y-2 text-base font-fredoka text-kid-blue-700">
        <p className="font-semibold">🌡️ Temperature: <span className="font-bold text-kid-blue-800">{temp.toFixed(1)}°C</span></p>
        <p className="font-semibold">☁️ Conditions: <span className="font-bold text-kid-blue-800">
          {weather === "rainy" ? "Rainy" : weather === "cloudy" ? "Cloudy" : "Sunny"}
        </span></p>
        {rain > 2000 && (
          <motion.p 
            className="text-kid-blue-600 font-bold text-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            🌧️ It&apos;s raining! Plants are happy! 🎉
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
