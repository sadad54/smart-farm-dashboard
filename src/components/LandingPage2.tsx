// src/components/LandingPage.tsx
"use client";
import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type LandingPageProps = {
  onEnter?: () => void;
};

export function LandingPage({ onEnter }: LandingPageProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleEnter = useCallback(() => {
    if (onEnter) onEnter();
  }, [onEnter]);

  // auto-enter after 15s
  useEffect(() => {
    const t = setTimeout(() => handleEnter(), 15000);
    return () => clearTimeout(t);
  }, [handleEnter]);

  const handleSelect = (id: string) => {
    setSelected(id);
    setTimeout(() => handleEnter(), 600);
  };

  const options = [
    { id: "smart-farm", title: "Smart Farm", image: "/assets/landing/smart-farm.png" },
    { id: "smart-house", title: "Smart House", image: "/assets/landing/smart-house.png" },
    { id: "smart-factory", title: "Smart Factory", image: "/assets/landing/smart-factory.png" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background image — full, positioned behind */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/backgrounds/Asset-16@4x.png"
          alt="KidzTechCentre Building"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Options row centered in screen */}
      <div className="relative z-10 flex items-center justify-center gap-8 px-6">
        {options.map((opt, i) => (
          <motion.button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            //className={`flex flex-col items-center justify-center gap-4 p-4 bg-white/80 rounded-3xl shadow-xl border-2 border-white/30 w-64 h-72`}
          >
            {/* robot image centered */}
            <div className="relative w-60 h-60 flex items-center justify-center">
              <Image
                src={opt.image}
                alt={opt.title}
                fill
                className="object-contain object-center"
              />
            </div>

            {/* title */}
            
          </motion.button>
        ))}
      </div>
    </div>
  );
}
