// src/app/page.tsx
"use client";
import { useEffect, useState, useMemo } from "react";

import { SensorCard } from "@/components/SensorCard";
import { CommandButton } from "@/components/CommandButton";

import { MissionPanel } from "@/components/MissionPanel";
import { AICoach } from "@/components/AICoach";
import { ActionTimeline } from "@/components/ActionTimeline";
import { DeviceStatus } from "@/components/DeviceStatus";
import { Droplets, Sun, Thermometer, Wind, Sparkles, Trophy, Book, TrendingUp, AlertTriangle, CloudRain, Bird } from "lucide-react";
import { AnimalDetector } from "@/components/AnimalDetector";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { WeatherCard } from "@/components/WeatherCard";
import { motion, AnimatePresence } from "framer-motion";
import {PlantHealthMeter} from "@/components/PlantHealthMeter"




type TimelineItem = { icon: string; text: string; t: number };
type Step = "sense" | "act" | "reflect" | "done";
type Tab = "play" | "see" | "learn";

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>("play");
  const [readings, setReadings] = useState<Record<string, number>>({
    soil: 2800,
    temp: 26,
    hum: 65,
    light: 850,
    water: 2500,
    rain: 500,
    _ts: Date.now(),
  });
  const [badges, setBadges] = useState<string[]>([]);
  const [animalDetected, setAnimalDetected] = useState(false);

  // Simulate sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setReadings(prev => ({
        ...prev,
        soil: prev.soil + (Math.random() - 0.5) * 50,
        temp: prev.temp + (Math.random() - 0.5) * 2,
        _ts: Date.now(),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate animal detection
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimalDetected(true);
      setTimeout(() => setAnimalDetected(false), 4000);
    }, 10000);
    return () => clearTimeout(timeout);
  }, []);

  const handleWater = async () => {
    window.dispatchEvent(new Event('plant-watered'));
    setReadings(prev => ({ ...prev, soil: 1800 }));
  };

  const addBadge = (badge: string) => {
    if (!badges.includes(badge)) {
      setBadges(prev => [...prev, badge]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kid-green-50 via-kid-blue-50 to-kid-yellow-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ repeat: Infinity, duration: 20 }}
          className="absolute top-10 left-10 text-6xl opacity-30 animate-float"
        >
          🌻
        </motion.div>
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
          transition={{ repeat: Infinity, duration: 25 }}
          className="absolute bottom-20 right-20 text-6xl opacity-30 animate-float"
        >
          🦋
        </motion.div>
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ repeat: Infinity, duration: 30 }}
          className="absolute top-1/3 right-1/4 text-5xl opacity-25 animate-float"
        >
          🌈
        </motion.div>
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ repeat: Infinity, duration: 35 }}
          className="absolute bottom-1/3 left-1/4 text-4xl opacity-25 animate-float"
        >
          🍄
        </motion.div>
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 40 }}
          className="absolute top-1/2 left-1/2 text-3xl opacity-20 animate-float"
        >
          ⭐
        </motion.div>
      </div>

      <DeviceStatus lastTs={readings._ts} />
      <AnimalDetector detected={animalDetected} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-display font-black text-kid-green-700 mb-4 flex items-center justify-center gap-4 animate-bounce-gentle">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🐣
            </motion.div>
            Smart Farm Junior
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            >
              🌱
            </motion.div>
          </h1>
          <p className="text-kid-blue-600 text-xl font-fredoka font-semibold animate-rainbow">Grow, Learn, and Have Fun! 🌈</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          {(["play", "see", "learn"] as Tab[]).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-3xl font-fredoka font-bold text-xl transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-kid-green-400 to-kid-blue-400 text-white shadow-2xl scale-110 border-4 border-kid-yellow-300"
                  : "bg-white/80 text-kid-green-700 hover:bg-white hover:scale-105 border-2 border-kid-green-200"
              }`}
              whileHover={{ scale: activeTab === tab ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab === "play" && "🎮 Let's Play!"}
              {tab === "see" && "👀 Watch & Learn"}
              {tab === "learn" && "📚 Fun Facts"}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "play" && (
            <motion.div
              key="play"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AICoach {...readings} />
                <BadgeDisplay badges={badges} />
              </div>

              <MissionPanel readings={readings} onComplete={addBadge} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PlantHealthMeter readings={readings} />
                <WeatherCard readings={readings} />
                <div className="bg-gradient-to-br from-kid-blue-100 to-kid-blue-200 rounded-3xl shadow-xl p-6 border-4 border-kid-blue-300 transform hover:scale-105 transition-all duration-300">
                  <h3 className="font-fredoka font-bold text-kid-blue-800 mb-3 flex items-center gap-3 text-lg">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-2xl"
                    >
                      💧
                    </motion.div>
                    Water Tank
                  </h3>
                  <div className="relative h-28 bg-white/70 rounded-2xl overflow-hidden border-2 border-kid-blue-300">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(readings.water / 4095) * 100}%` }}
                      className="absolute bottom-0 w-full bg-gradient-to-t from-kid-blue-500 to-kid-blue-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-2xl opacity-60"
                      >
                        🌊
                      </motion.div>
                    </div>
                  </div>
                  <p className="text-kid-blue-800 mt-3 text-center font-fredoka font-semibold text-lg">
                    {((readings.water / 4095) * 100).toFixed(0)}% Full! 🎉
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SensorCard label="Soil Moisture" value={readings.soil?.toFixed(0)} icon={<Droplets />} trend="down" />
                <SensorCard label="Light Level" value={readings.light?.toFixed(0)} icon={<Sun />} trend="stable" />
                <SensorCard label="Temperature" value={readings.temp?.toFixed(1)} unit="°C" icon={<Thermometer />} trend="up" />
                <SensorCard label="Humidity" value={readings.hum?.toFixed(0)} unit="%" icon={<Wind />} trend="stable" />
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                <CommandButton label="💧 Water Plant" icon="💧" onClick={handleWater} />
                <CommandButton label="🌬️ Run Fan" icon="🌬️" onClick={() => {}} />
                <CommandButton label="💡 Toggle Light" icon="💡" onClick={() => {}} />
                <CommandButton label="🌾 Feed Animals" icon="🌾" onClick={() => {}} />
              </div>
            </motion.div>
          )}

          {activeTab === "see" && (
            <motion.div
              key="see"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-kid-purple-100 to-kid-pink-100 rounded-3xl shadow-xl p-8 border-4 border-kid-purple-300">
                <h2 className="text-3xl font-display font-bold text-kid-purple-800 mb-6 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="text-3xl"
                  >
                    📈
                  </motion.div>
                  Farm Analytics
                </h2>
                <div className="h-72 bg-gradient-to-br from-white/80 to-kid-purple-50 rounded-2xl flex items-center justify-center border-2 border-kid-purple-200">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-6xl mb-4"
                    >
                      📊
                    </motion.div>
                    <p className="text-kid-purple-600 font-fredoka text-lg">Live charts would appear here! 📈✨</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-kid-green-100 to-kid-green-200 rounded-3xl shadow-xl p-6 border-4 border-kid-green-300 transform hover:scale-105 transition-all duration-300">
                  <h3 className="font-fredoka font-bold text-kid-green-800 mb-4 text-xl flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      📊
                    </motion.div>
                    Daily Summary
                  </h3>
                  <div className="space-y-3 text-base font-fredoka">
                    <p className="text-kid-green-700 flex items-center gap-2">🌱 Plants watered: <span className="font-bold text-kid-green-800">3 times</span></p>
                    <p className="text-kid-green-700 flex items-center gap-2">💧 Water used: <span className="font-bold text-kid-green-800">2.5L</span></p>
                    <p className="text-kid-green-700 flex items-center gap-2">☀️ Sun exposure: <span className="font-bold text-kid-green-800">8 hours</span></p>
                    <p className="text-kid-green-700 flex items-center gap-2">🐔 Animal visits: <span className="font-bold text-kid-green-800">2</span></p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-kid-yellow-100 to-kid-orange-100 rounded-3xl shadow-xl p-6 border-4 border-kid-yellow-300 transform hover:scale-105 transition-all duration-300">
                  <h3 className="font-fredoka font-bold text-kid-orange-800 mb-4 text-xl flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      🏆
                    </motion.div>
                    Achievements
                  </h3>
                  <div className="space-y-3 text-base font-fredoka">
                    <p className="text-kid-orange-700 flex items-center gap-2">✅ <span className="font-bold text-kid-orange-800">7-day care streak</span></p>
                    <p className="text-kid-orange-700 flex items-center gap-2">✅ <span className="font-bold text-kid-orange-800">Perfect watering today</span></p>
                    <p className="text-kid-orange-700 flex items-center gap-2">✅ <span className="font-bold text-kid-orange-800">Plant health above 80%</span></p>
                    <p className="text-kid-orange-700 flex items-center gap-2">🎯 <span className="font-bold text-kid-orange-800">Next: Earn "Master Gardener"</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "learn" && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-kid-blue-100 to-kid-green-100 rounded-3xl shadow-xl p-8 border-4 border-kid-blue-300">
                <h2 className="text-3xl font-display font-bold text-kid-blue-800 mb-6 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 6 }}
                    className="text-4xl"
                  >
                    📚
                  </motion.div>
                  How Your Smart Farm Works
                </h2>
                <div className="prose max-w-none">
                  <div className="bg-white/60 rounded-2xl p-6 mb-6 border-2 border-kid-green-200">
                    <h3 className="text-xl font-fredoka font-bold text-kid-green-700 mb-3 flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        🌱
                      </motion.div>
                      The Plant Growth Cycle
                    </h3>
                    <p className="text-kid-green-800 font-fredoka text-lg">Plants need three main things to grow: water, sunlight, and nutrients. Your smart farm helps monitor all of these! 🌟</p>
                  </div>
                  
                  <div className="bg-white/60 rounded-2xl p-6 mb-6 border-2 border-kid-blue-200">
                    <h3 className="text-xl font-fredoka font-bold text-kid-blue-700 mb-3 flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        🤖
                      </motion.div>
                      How the Sensors Work
                    </h3>
                    <ul className="text-kid-blue-800 space-y-3 font-fredoka text-lg">
                      <li className="flex items-start gap-2"><span className="text-2xl">💧</span><strong>Soil Moisture Sensor:</strong> Checks how wet or dry the soil is</li>
                      <li className="flex items-start gap-2"><span className="text-2xl">🌡️</span><strong>Temperature Sensor:</strong> Measures how hot or cold it is</li>
                      <li className="flex items-start gap-2"><span className="text-2xl">☀️</span><strong>Light Sensor:</strong> Tells us if the plant has enough sunlight</li>
                      <li className="flex items-start gap-2"><span className="text-2xl">🐾</span><strong>Motion Sensor:</strong> Detects when animals visit the farm</li>
                    </ul>
                  </div>

                  <div className="bg-white/60 rounded-2xl p-6 border-2 border-kid-purple-200">
                    <h3 className="text-xl font-fredoka font-bold text-kid-purple-700 mb-3 flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                      >
                        🔬
                      </motion.div>
                      Science Fun Facts
                    </h3>
                    <ul className="text-kid-purple-800 space-y-3 font-fredoka text-lg">
                      <li className="flex items-start gap-2"><span className="text-2xl">🌿</span>Plants "breathe" in carbon dioxide and "breathe" out oxygen</li>
                      <li className="flex items-start gap-2"><span className="text-2xl">💧</span>A single corn plant can use 200 liters of water in one season</li>
                      <li className="flex items-start gap-2"><span className="text-2xl">🌍</span>Healthy soil contains billions of living organisms</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-kid-green-100 to-kid-green-200 rounded-3xl shadow-xl p-6 border-4 border-kid-green-300 transform hover:scale-105 transition-all duration-300">
                  <h3 className="font-fredoka font-bold text-kid-green-800 mb-4 text-xl flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      🎓
                    </motion.div>
                    For Parents
                  </h3>
                  <p className="text-kid-green-700 font-fredoka text-lg mb-3">This smart farm teaches:</p>
                  <ul className="space-y-2 text-base font-fredoka text-kid-green-800">
                    <li className="flex items-center gap-2">✅ <span className="font-semibold">STEM concepts</span> (Science, Technology, Engineering, Math)</li>
                    <li className="flex items-center gap-2">✅ <span className="font-semibold">Environmental awareness</span></li>
                    <li className="flex items-center gap-2">✅ <span className="font-semibold">Responsibility and care</span></li>
                    <li className="flex items-center gap-2">✅ <span className="font-semibold">Data analysis and observation</span></li>
                    <li className="flex items-center gap-2">✅ <span className="font-semibold">Problem-solving skills</span></li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-kid-blue-100 to-kid-blue-200 rounded-3xl shadow-xl p-6 border-4 border-kid-blue-300 transform hover:scale-105 transition-all duration-300">
                  <h3 className="font-fredoka font-bold text-kid-blue-800 mb-4 text-xl flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      🔒
                    </motion.div>
                    Safety & Privacy
                  </h3>
                  <p className="text-kid-blue-700 font-fredoka text-lg mb-3">Your farm data is:</p>
                  <ul className="space-y-2 text-base font-fredoka text-kid-blue-800">
                    <li className="flex items-center gap-2">✅ <span className="font-semibold">Stored securely</span></li>
                    <li className="flex items-center gap-2">✅ <span className="font-semibold">Only visible to your family</span></li>
                    <li className="flex items-center gap-2">✅ <span className="font-semibold">Used only for learning</span></li>
                    <li className="flex items-center gap-2">✅ <span className="font-semibold">Never shared with third parties</span></li>
                    <li className="flex items-center gap-2">✅ <span className="font-semibold">Compliant with privacy laws</span></li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}