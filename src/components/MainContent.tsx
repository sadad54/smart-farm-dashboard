"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { SensorCard } from "@/components/SensorCard";
import { CommandButton } from "@/components/CommandButton";

import { PlantHealthMeter } from "@/components/PlantHealthMeter";
import { Droplets, Sun, Thermometer, Wind } from "lucide-react";

interface MainContentProps {
  readings: Record<string, number>;
  onWater: () => void;
  badges: string[];
  activeSection: string;
}

export function MainContent({ readings, onWater, badges, activeSection }: MainContentProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const SectionHeading = ({ title, emoji }: { title: string; emoji: string }) => (
    <h2 className="text-3xl font-display font-bold text-kid-green-700 mb-6 flex items-center gap-3">
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="text-3xl"
      >
        {emoji}
      </motion.div>
      {title}
    </h2>
  );

  const LightCard = () => (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white/90 rounded-3xl shadow-xl p-6 border-4 border-kid-green-200"
    >
      <div className="text-center">
        <div className="text-5xl mb-4">💡</div>
        <h3 className="font-fredoka font-bold text-kid-green-800 text-lg mb-3">Light Control</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-kid-green-400 to-kid-green-500 text-white font-fredoka font-bold py-3 px-6 rounded-2xl shadow-lg border-2 border-kid-green-300 mb-2"
        >
          Toggle
        </motion.button>
        <p className="font-fredoka text-kid-green-700 text-sm">Light is On</p>
      </div>
    </motion.div>
  );

  const MotionCard = () => (
    <motion.div className="bg-white/90 rounded-3xl shadow-xl p-6 border-4 border-kid-green-200">
      <div className="text-center">
        <div className="text-5xl mb-4">🏃</div>
        <h3 className="font-fredoka font-bold text-kid-green-800 text-lg mb-3">Motion Sensor</h3>
        <div className="bg-gradient-to-r from-kid-green-400 to-kid-green-500 text-white font-fredoka font-bold py-2 px-4 rounded-xl mb-2">ACTIVE</div>
        <p className="font-fredoka text-kid-green-700 text-sm">AI is Operating</p>
      </div>
    </motion.div>
  );

  const WaterTankCard = () => (
    <motion.div className="bg-gradient-to-br from-kid-blue-100 to-kid-blue-200 rounded-3xl shadow-xl p-6 border-4 border-kid-blue-300">
      <h3 className="font-fredoka font-bold text-kid-blue-800 mb-3 text-lg">Water Tank</h3>
      <div className="relative h-28 bg-white/70 rounded-2xl overflow-hidden border-2 border-kid-blue-300">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${(readings.water / 4095) * 100}%` }}
          className="absolute bottom-0 w-full bg-gradient-to-t from-kid-blue-500 to-kid-blue-300"
        />
      </div>
      <p className="text-kid-blue-800 mt-3 text-center font-fredoka font-semibold text-lg">{((readings.water / 4095) * 100).toFixed(0)}% Full</p>
    </motion.div>
  );

  const SensorsRow = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SensorCard label="Soil Moisture" value={readings.soil?.toFixed(0)} icon={<Droplets />} trend="down" />
      <SensorCard label="Light Level" value={readings.light?.toFixed(0)} icon={<Sun />} trend="stable" />
      <SensorCard label="Temperature" value={readings.temp?.toFixed(1)} unit="°C" icon={<Thermometer />} trend="up" />
      <SensorCard label="Humidity" value={readings.hum?.toFixed(0)} unit="%" icon={<Wind />} trend="stable" />
    </div>
  );

  const ActionsRow = () => (
    <div className="flex flex-wrap justify-center gap-4">
      <CommandButton label="💧 Water Plant" icon="💧" onClick={onWater} />
      <CommandButton label="🌬️ Run Fan" icon="🌬️" onClick={() => {}} />
      <CommandButton label="💡 Toggle Light" icon="💡" onClick={() => {}} />
    </div>
  );

  const renderHome = () => (
    <div className="space-y-6">
      <SectionHeading title="Device Status" emoji="📊" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlantHealthMeter readings={readings} />
        <WaterTankCard />
      </div>
      <SensorsRow />
      <ActionsRow />
    </div>
  );

  const renderAI = () => (
    <div className="space-y-6">
      <SectionHeading title="AI Insights" emoji="🧠" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div className="bg-gradient-to-br from-kid-purple-100 to-kid-pink-100 rounded-3xl shadow-xl p-6 border-4 border-kid-purple-300">
          <h3 className="font-fredoka font-bold text-kid-purple-800 mb-4 text-xl">Farm Analytics</h3>
          <div className="h-56 bg-white/80 rounded-2xl flex items-center justify-center border-2 border-kid-purple-200">📈</div>
        </motion.div>
        <motion.div className="bg-gradient-to-br from-kid-yellow-100 to-kid-orange-100 rounded-3xl shadow-xl p-6 border-4 border-kid-yellow-300">
          <h3 className="font-fredoka font-bold text-kid-orange-800 mb-4 text-xl">Achievements</h3>
          <p className="font-fredoka text-kid-orange-700">You have {badges.length} achievements!</p>
        </motion.div>
      </div>
    </div>
  );

  const renderFunFacts = () => (
    <div className="space-y-6">
      <SectionHeading title="How Your Smart Farm Works" emoji="📚" />
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
  );

  const renderLight = () => (
    <div className="space-y-6">
      <SectionHeading title="Light" emoji="💡" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LightCard />
        <motion.div className="bg-white/90 rounded-3xl shadow-xl p-6 border-4 border-kid-yellow-200">
          <h3 className="font-fredoka font-bold text-kid-yellow-800 text-lg mb-3">Light Sensor</h3>
          <p className="font-display font-black text-kid-yellow-700 text-2xl">{readings.light?.toFixed(0)} lux</p>
        </motion.div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SensorCard label="Light Level" value={readings.light?.toFixed(0)} icon={<Sun />} trend="stable" />
      </div>
      <div className="flex justify-start">
        <CommandButton label="💡 Toggle Light" icon="💡" onClick={() => {}} />
      </div>
    </div>
  );

  const renderMotion = () => (
    <div className="space-y-6">
      <SectionHeading title="Motion" emoji="🏃" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MotionCard />
      </div>
    </div>
  );

  const renderTemperature = () => (
    <div className="space-y-6">
      <SectionHeading title="Temperature" emoji="🌡️" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SensorCard label="Temperature" value={readings.temp?.toFixed(1)} unit="°C" icon={<Thermometer />} trend="up" />
        <SensorCard label="Humidity" value={readings.hum?.toFixed(0)} unit="%" icon={<Wind />} trend="stable" />
      </div>
      <div className="flex justify-start">
        <CommandButton label="🌬️ Run Fan" icon="🌬️" onClick={() => {}} />
      </div>
    </div>
  );

  const renderWater = () => (
    <div className="space-y-6">
      <SectionHeading title="Water" emoji="💧" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WaterTankCard />
      </div>
      <div className="flex justify-start">
        <CommandButton label="💧 Water Plant" icon="💧" onClick={onWater} />
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "ai-insights":
        return renderAI();
      case "fun-facts":
        return renderFunFacts();
      case "light":
        return renderLight();
      case "motion":
        return renderMotion();
      case "temperature":
        return renderTemperature();
      case "water":
        return renderWater();
      case "home":
      default:
        return renderHome();
    }
  };

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-kid-green-50 via-kid-blue-50 to-kid-yellow-50 min-h-screen">
      {/* Header with Title, Date/Time */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-5xl font-display font-black text-kid-green-700 flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl"
            >
              🐣
            </motion.div>
            Smart Farming Dashboard
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              className="text-4xl"
            >
              🌱
            </motion.div>
          </h1>
        </div>
        
        {/* Date and Time Display */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 rounded-2xl p-4 border-2 border-kid-green-200 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-2xl"
              >
                📅
              </motion.div>
              <div>
                <p className="font-fredoka font-bold text-kid-green-800 text-lg">
                  {formatDate(currentTime)}
                </p>
                <p className="font-fredoka text-kid-green-600 text-sm">
                  Current Date & Time
                </p>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-right"
            >
              <p className="font-display font-black text-kid-green-700 text-2xl">
                {formatTime(currentTime)}
              </p>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
                <span className="font-fredoka text-green-600 text-sm font-semibold">
                  Live
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Section Content */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
        {renderSection()}
      </motion.div>

      {/* Mascot Display */}
      
    </div>
  );
}
