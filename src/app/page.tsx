// src/app/page.tsx
"use client";
import { useEffect, useState, useMemo } from "react";

import { Sidebar } from "@/components/Sidebar";
import { MainContent } from "@/components/MainContent";
import { DeviceStatus } from "@/components/DeviceStatus";
import { AnimalDetector } from "@/components/AnimalDetector";
import { motion, AnimatePresence } from "framer-motion";




type TimelineItem = { icon: string; text: string; t: number };
type Step = "sense" | "act" | "reflect" | "done";
type Tab = "play" | "see" | "learn";
type Section = "home" | "light" | "motion" | "temperature" | "light-sensor" | "ai-insights" | "fun-facts" | "water";

export default function Page() {
  const [activeSection, setActiveSection] = useState<Section>("home");
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

  // User info for sidebar
  const userInfo = {
    name: "Tacetus, JLF P",
    id: "855",
    time: "678 AM"
  };

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

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logout clicked");
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

      {/* Main Layout with Sidebar and Content */}
      <div className="relative z-10 flex min-h-screen">
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={(section: string) => setActiveSection(section as Section)}
          onLogout={handleLogout}
          userInfo={userInfo}
        />
        <MainContent 
          readings={readings}
          onWater={handleWater}
          badges={badges}
          activeSection={activeSection}
        />
      </div>
    </div>
  );
}