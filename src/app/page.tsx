// src/app/page.tsx
"use client";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { SensorCard } from "@/components/SensorCard";
import { CommandButton } from "@/components/CommandButton";
import { LiveChart } from "@/components/LiveChart";
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

const mockSupabase = {
  channel: () => ({
    on: () => ({ subscribe: () => {} }),
  }),
  removeChannel: () => {},
};


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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ repeat: Infinity, duration: 20 }}
          className="absolute top-10 left-10 text-6xl opacity-20"
        >
          🌻
        </motion.div>
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
          transition={{ repeat: Infinity, duration: 25 }}
          className="absolute bottom-20 right-20 text-6xl opacity-20"
        >
          🦋
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
          <h1 className="text-5xl font-extrabold text-green-800 mb-2 flex items-center justify-center gap-3">
            <Bird className="w-12 h-12" />
            Smart Farm Junior
          </h1>
          <p className="text-gray-600 text-lg">Grow, Learn, and Have Fun! 🌱</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          {(["play", "see", "learn"] as Tab[]).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all ${
                activeTab === tab
                  ? "bg-green-500 text-white shadow-lg scale-105"
                  : "bg-white/70 text-gray-700 hover:bg-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab === "play" && "🎮 Play"}
              {tab === "see" && "📊 See"}
              {tab === "learn" && "📚 Learn"}
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
                <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl shadow-lg p-4 border border-orange-200">
                  <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                    <Droplets className="w-5 h-5" />
                    Water Tank
                  </h3>
                  <div className="relative h-24 bg-white/50 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(readings.water / 4095) * 100}%` }}
                      className="absolute bottom-0 w-full bg-blue-400"
                    />
                  </div>
                  <p className="text-sm text-orange-800 mt-2 text-center">
                    {((readings.water / 4095) * 100).toFixed(0)}% Full
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SensorCard label="Soil Moisture" value={readings.soil?.toFixed(0)} icon={<Droplets />} trend="down" />
                <SensorCard label="Light Level" value={readings.light?.toFixed(0)} icon={<Sun />} trend="stable" />
                <SensorCard label="Temperature" value={readings.temp?.toFixed(1)} unit="°C" icon={<Thermometer />} trend="up" />
                <SensorCard label="Humidity" value={readings.hum?.toFixed(0)} unit="%" icon={<Wind />} trend="stable" />
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <CommandButton label="Water Plant" icon="💧" onClick={handleWater} />
                <CommandButton label="Run Fan" icon="🌬️" onClick={() => {}} />
                <CommandButton label="Toggle Light" icon="💡" onClick={() => {}} />
                <CommandButton label="Feed Animals" icon="🌾" onClick={() => {}} />
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
              <div className="bg-white/90 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📈 Farm Analytics</h2>
                <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">Live charts would appear here</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/90 rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-gray-800 mb-3">📊 Daily Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p>🌱 Plants watered: 3 times</p>
                    <p>💧 Water used: 2.5L</p>
                    <p>☀️ Sun exposure: 8 hours</p>
                    <p>🐔 Animal visits: 2</p>
                  </div>
                </div>
                
                <div className="bg-white/90 rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-gray-800 mb-3">🏆 Achievements</h3>
                  <div className="space-y-2 text-sm">
                    <p>✅ 7-day care streak</p>
                    <p>✅ Perfect watering today</p>
                    <p>✅ Plant health above 80%</p>
                    <p>🎯 Next: Earn "Master Gardener"</p>
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
              <div className="bg-white/90 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Book className="w-8 h-8 text-green-600" />
                  How Your Smart Farm Works
                </h2>
                <div className="prose max-w-none">
                  <h3 className="text-lg font-bold text-green-700">🌱 The Plant Growth Cycle</h3>
                  <p className="text-gray-700">Plants need three main things to grow: water, sunlight, and nutrients. Your smart farm helps monitor all of these!</p>
                  
                  <h3 className="text-lg font-bold text-green-700 mt-4">🤖 How the Sensors Work</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li><strong>Soil Moisture Sensor:</strong> Checks how wet or dry the soil is</li>
                    <li><strong>Temperature Sensor:</strong> Measures how hot or cold it is</li>
                    <li><strong>Light Sensor:</strong> Tells us if the plant has enough sunlight</li>
                    <li><strong>Motion Sensor:</strong> Detects when animals visit the farm</li>
                  </ul>

                  <h3 className="text-lg font-bold text-green-700 mt-4">🔬 Science Fun Facts</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>🌿 Plants "breathe" in carbon dioxide and "breathe" out oxygen</li>
                    <li>💧 A single corn plant can use 200 liters of water in one season</li>
                    <li>🌍 Healthy soil contains billions of living organisms</li>
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-lg p-6 border-2 border-green-300">
                  <h3 className="font-bold text-green-800 mb-3 text-lg">🎓 For Parents</h3>
                  <p className="text-sm text-green-900">This smart farm teaches:</p>
                  <ul className="mt-2 space-y-1 text-sm text-green-800">
                    <li>✓ STEM concepts (Science, Technology, Engineering, Math)</li>
                    <li>✓ Environmental awareness</li>
                    <li>✓ Responsibility and care</li>
                    <li>✓ Data analysis and observation</li>
                    <li>✓ Problem-solving skills</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl shadow-lg p-6 border-2 border-blue-300">
                  <h3 className="font-bold text-blue-800 mb-3 text-lg">🔒 Safety & Privacy</h3>
                  <p className="text-sm text-blue-900">Your farm data is:</p>
                  <ul className="mt-2 space-y-1 text-sm text-blue-800">
                    <li>✓ Stored securely</li>
                    <li>✓ Only visible to your family</li>
                    <li>✓ Used only for learning</li>
                    <li>✓ Never shared with third parties</li>
                    <li>✓ Compliant with privacy laws</li>
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