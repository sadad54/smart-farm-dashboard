// src/components/LandingPage.tsx
"use client";
import Image from "next/image";
import { useEffect, useCallback } from "react";

type LandingPageProps = {
  onEnter?: () => void;
};

export function LandingPage({ onEnter }: LandingPageProps) {
  // Handler when the user clicks or times out
  const handleEnter = useCallback(() => {
    if (onEnter) onEnter();
  }, [onEnter]);

  useEffect(() => {
    if (!onEnter) return;

    // Automatically navigate after 10 seconds
    const timer = window.setTimeout(() => handleEnter(), 10000);

    // Cleanup
    return () => clearTimeout(timer);
  }, [handleEnter, onEnter]);

  return (
    <div
      className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-200 to-yellow-100 cursor-pointer"
      onClick={handleEnter} // Navigate when user clicks anywhere
    >
      {/* Fullscreen background image, centered, no crop */}
      <Image
        src="/assets/landing/kidz-tech-centre-building.jpg"
        alt="Kidz Tech Centre"
        fill
        priority
        quality={100}
        className="object-contain object-center"
      />

      {/* Optional overlay / content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-white drop-shadow-lg">
        <p className="text-xl font-medium animate-pulse">Tap anywhere to enter</p>
      </div>
    </div>
  );
}
