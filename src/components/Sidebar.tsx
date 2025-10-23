"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Home, 
  Lightbulb, 
  Thermometer, 
  Sun, 
  Brain,
  Droplets,
  Activity,
  LogOut,
  PartyPopper
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  userInfo: {
    name: string;
    id: string;
    time: string;
  };
}

export function Sidebar({ activeSection, onSectionChange, onLogout, userInfo }: SidebarProps) {
  const sidebarItems = [
    { id: "home", label: "Home", icon: Home, color: "from-kid-orange-400 to-kid-orange-500" },
    { id: "ai-insights", label: "AI Insights", icon: Brain, color: "from-kid-blue-400 to-kid-blue-500" },
    { id: "fun-facts", label: "Fun Facts", icon: PartyPopper, color: "from-kid-pink-300 to-kid-purple-400" },
    { id: "light", label: "Light", icon: Lightbulb, color: "from-kid-yellow-400 to-kid-yellow-500" },
    { id: "motion", label: "Motion", icon: Activity, color: "from-kid-green-400 to-kid-green-500" },
    { id: "temperature", label: "Temperature", icon: Thermometer, color: "from-kid-orange-400 to-kid-orange-500" },
    { id: "water", label: "Water", icon: Droplets, color: "from-kid-blue-300 to-kid-blue-500" },
  ];

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-80 bg-gradient-to-b from-kid-green-100 to-kid-blue-100 rounded-r-3xl shadow-2xl border-r-4 border-kid-green-300 min-h-screen flex flex-col"
    >
      {/* SFRP Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 text-center border-b-2 border-kid-green-200"
      >
        <h1 className="text-3xl font-display font-black text-white bg-gradient-to-r from-kid-green-600 to-kid-blue-600 bg-clip-text text-transparent">
          SFRP
        </h1>
      </motion.div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-3">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-fredoka font-bold text-lg transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-xl border-2 border-white/30`
                  : "bg-white/80 text-kid-green-700 hover:bg-white hover:shadow-lg border-2 border-kid-green-200"
              }`}
            >
              <motion.div
                animate={isActive ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-2xl"
              >
                <Icon className="w-6 h-6" />
              </motion.div>
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* User Info and Logout */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-4 border-t-2 border-kid-green-200"
      >
        {/* User Info */}
        <div className="bg-white/80 rounded-2xl p-4 mb-3 border-2 border-kid-green-200">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-2xl"
            >
              👤
            </motion.div>
            <div>
              <p className="font-fredoka font-bold text-kid-green-800 text-sm">
                {userInfo.name}
              </p>
              <p className="font-fredoka text-kid-green-600 text-xs">
                {userInfo.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-green-500"
            >
              ●
            </motion.div>
            <span className="font-fredoka font-semibold text-kid-green-700 text-sm">
              {userInfo.time}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-kid-orange-400 to-kid-orange-500 text-white font-fredoka font-bold py-3 px-4 rounded-2xl shadow-lg border-2 border-kid-orange-300 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5" />
            <span>LOG OUT</span>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
