// src/app/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-server";
import { Sidebar } from "@/components/Sidebar";
import { MainContent } from "@/components/MainContent";
import { DeviceStatus } from "@/components/DeviceStatus";
import { AnimalDetector } from "@/components/AnimalDetector";
import { LandingPage as LandingPage1 } from "@/components/LandingPage";
import { LandingPage as LandingPage2 } from "@/components/LandingPage2";
// Import the new StartScreen component
import { StartScreen } from "@/components/StartScreen";
import { motion, AnimatePresence } from "framer-motion";

type Section = "home" | "light" | "motion" | "temperature" | "light-sensor" | "ai-insights" | "fun-facts" | "water";

export default function Page() {
  // 0 = landing1, 1 = landing2, 2 = startScreen, 3 = dashboard
  const [landingStage, setLandingStage] = useState<number>(0);
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

  const userInfo = {
    name: "Tacetus, JLF P",
    id: "855",
    time: "678 AM"
  };

  useEffect(() => {
    const channel = supabase
      .channel('public:sensor_readings')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sensor_readings' },
        (payload) => {
          const { metric, value } = payload.new;
          setReadings((prev) => ({
            ...prev,
            [metric]: value,
            _ts: Date.now(),
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimalDetected(true);
      setTimeout(() => setAnimalDetected(false), 4000);
    }, 10000);
    return () => clearTimeout(timeout);
  }, []);

  const issueCommand = async (action: string) => {
    try {
      await fetch('/api/commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: 'farm_001',
          command: { action },
        }),
      });
    } catch (error) {
      console.error("Failed to issue command:", error);
    }
  };

  const handleWater = async () => {
    await issueCommand('water');
    window.dispatchEvent(new Event('plant-watered'));
  };

  const handleFan = async () => {
    await issueCommand('fan');
  };

  const handleLight = async () => {
    await issueCommand('light');
  };

  const addBadge = (badge: string) => {
    if (!badges.includes(badge)) {
      setBadges(prev => [...prev, badge]);
    }
  };

  const handleLogout = () => {
    setLandingStage(0);
  };

  const handleEnterFromLanding1 = () => {
    setLandingStage(1);
  };

  const handleEnterFromLanding2 = () => {
    // Update to go to stage 2 (StartScreen)
    setLandingStage(2);
  };

  // Add new handler for StartScreen
  const handleEnterFromStartScreen = () => {
    setLandingStage(3);
  };

  const getLandingKey = () => {
    if (landingStage === 0) return "landing1";
    if (landingStage === 1) return "landing2";
    if (landingStage === 2) return "startScreen";
    return "dashboard";
  };

  return (
    <AnimatePresence mode="wait">
      {/* Update condition to include new stage 2 */}
      {landingStage < 3 ? (
        <motion.div
          // Update key to be dynamic based on stage
          key={getLandingKey()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          {landingStage === 0 ? (
            <LandingPage1 onEnter={handleEnterFromLanding1} />
          ) : landingStage === 1 ? (
            <LandingPage2 onEnter={handleEnterFromLanding2} />
          ) : (
            // Render StartScreen at stage 2
            <StartScreen onEnter={handleEnterFromStartScreen} />
          )}
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-br from-kid-green-50 via-kid-blue-50 to-kid-yellow-50 relative overflow-hidden"
        >
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
          </div>

          <DeviceStatus lastTs={readings._ts} />
          <AnimalDetector detected={animalDetected} />

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
              onFan={handleFan}
              onLight={handleLight}
              addBadge={addBadge}
              badges={badges}
              activeSection={activeSection}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}