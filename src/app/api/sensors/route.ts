import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const { device_id, readings } = await req.json();

    if (!device_id) {
      return NextResponse.json({ error: "Missing device_id" }, { status: 400 });
    }

    const sensorData = readings.map((r: any) => ({
      device_id,
      metric: r.metric,
      value: r.value,
    }));

    const { error } = await supabase.from('sensor_readings').insert(sensorData);
    if (error) throw error;

    await supabase.from('device_status').upsert({
      device_id,
      is_online: true,
      last_seen: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sensor API Error:", error);
    return NextResponse.json({ error: "Failed to store readings" }, { status: 500 });
  }
}