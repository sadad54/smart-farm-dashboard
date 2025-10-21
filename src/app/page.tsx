"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SensorCard } from "@/components/SensorCard";
import { CommandButton } from "@/components/CommandButton";
import { LiveChart } from "@/components/LiveChart";
import { Droplets, Sun, Thermometer, Wind } from "lucide-react";

interface Reading {
  metric: string;
  value: number;
}

export default function Page() {
  const [readings, setReadings] = useState<Record<string, number>>({});

  useEffect(() => {
    // subscribe to Supabase realtime updates
    const channel = supabase
      .channel("public:sensor_readings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sensor_readings" },
        (payload) => {
          setReadings((prev) => ({
            ...prev,
            [payload.new.metric]: payload.new.value
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-50 to-white flex flex-col items-center py-10 gap-8">
      <h1 className="text-3xl font-extrabold text-green-800">
        🌾 Smart Farm Jr. Dashboard
      </h1>

      {/* Sensor display grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SensorCard
          label="Soil"
          value={readings["soil"]?.toFixed(1) ?? "--"}
          unit="%"
          icon={<Droplets />}
        />
        <SensorCard
          label="Light"
          value={readings["light"]?.toFixed(0) ?? "--"}
          icon={<Sun />}
        />
        <SensorCard
          label="Temp"
          value={readings["temp"]?.toFixed(1) ?? "--"}
          unit="°C"
          icon={<Thermometer />}
        />
        <SensorCard
          label="Humidity"
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
      <div className="flex flex-wrap gap-4 mt-8">
        <CommandButton label="💧 Water Plant" command={{ pump: "ON", duration_ms: 3000 }} />
        <CommandButton label="💡 Toggle Light" command={{ led: "ON", duration_ms: 5000 }} />
        <CommandButton label="🌬️ Run Fan" command={{ fan: "ON", duration_ms: 5000 }} />
      </div>
    </main>
  );
}
