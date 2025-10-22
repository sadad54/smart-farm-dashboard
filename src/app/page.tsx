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
import { Droplets, Sun, Thermometer, Wind } from "lucide-react";

type TimelineItem = { icon: string; text: string; t: number };

export default function Page() {
  const [readings, setReadings] = useState<Record<string, number>>({});
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  
  const lastSeenTimestamp = useMemo(() => readings["_ts"], [readings]);

  // Listen for new sensor readings
  useEffect(() => {
    const sensorChannel = supabase
      .channel("public:sensor_readings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sensor_readings" },
        (payload) => {
          const { metric, value } = payload.new;
          setReadings((prev) => ({ ...prev, [metric]: value, _ts: Date.now() }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sensorChannel);
    };
  }, []);

  // Listen for command acknowledgements from the device
  useEffect(() => {
    const commandChannel = supabase
      .channel("public:commands")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "commands" },
        (payload) => {
          if (payload.new.status === "ack") {
            const cmd = Object.keys(payload.new.command)[0];
            addTimelineItem("✅", `Action confirmed: ${cmd} ran successfully!`);
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(commandChannel);
    };
  }, []);

  const addTimelineItem = (icon: string, text: string) => {
    setTimeline((t) => [...t, { icon, text, t: Date.now() }]);
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 flex flex-col items-center py-8 px-4 gap-6">
      <DeviceStatus lastTs={lastSeenTimestamp} />
      <h1 className="text-4xl font-extrabold text-green-800">
        🌾 Smart Farm Jr. Dashboard
      </h1>

      <AICoach {...readings} />
      <MissionPanel readings={readings} />

      {/* Sensor display grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SensorCard
          label="Soil Moisture"
          value={readings["soil"]?.toFixed(0) ?? "--"}
          icon={<Droplets />}
        />
        <SensorCard
          label="Light Level"
          value={readings["light"]?.toFixed(0) ?? "--"}
          icon={<Sun />}
        />
        <SensorCard
          label="Temperature"
          value={readings["temp"]?.toFixed(1) ?? "--"}
          unit="°C"
          icon={<Thermometer />}
        />
        <SensorCard
          label="Air Humidity"
          value={readings["hum"]?.toFixed(0) ?? "--"}
          unit="%"
          icon={<Wind />}
        />
      </div>

      {/* Live chart */}
      <div className="w-11/12 md:w-2/3">
        <LiveChart />
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        <CommandButton 
          label="Water Plant" 
          command={{ pump: "ON", duration_ms: 3000 }} 
          icon="💧"
          className="bg-blue-500 hover:bg-blue-600"
        />
        <CommandButton 
          label="Run Fan" 
          command={{ fan: "ON", duration_ms: 10000 }} 
          icon="🌬️"
          className="bg-sky-500 hover:bg-sky-600"
        />
        <CommandButton 
          label="Toggle Light" 
          command={{ led: "ON", duration_ms: 10000 }} 
          icon="💡"
          className="bg-amber-500 hover:bg-amber-600"
        />
      </div>
      
      {/* Action Timeline */}
      <div className="w-11/12 md:w-2/3 mt-4">
        <ActionTimeline items={timeline} />
      </div>
    </main>
  );
}