"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from "chart.js";
import { supabase } from "@/lib/supabase";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

export function LiveChart() {
  const [dataPoints, setDataPoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel("public:sensor_readings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sensor_readings" },
        (payload) => {
          if (payload.new.metric === "soil") {
            setDataPoints((p) => [
              ...p.slice(-40),
              { x: Date.now(), y: payload.new.value }
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-white/70 rounded-2xl shadow-md p-4 w-full">
      <h2 className="font-semibold mb-2 text-gray-700">🌱 Soil Moisture</h2>
      <Line
        data={{
          datasets: [
            {
              label: "Soil",
              data: dataPoints,
              borderColor: "#16a34a",
              tension: 0.3
            }
          ]
        }}
        options={{
          animation: false,
          scales: {
            x: { type: "linear", display: false },
            y: { beginAtZero: true }
          }
        }}
      />
    </div>
  );
}
