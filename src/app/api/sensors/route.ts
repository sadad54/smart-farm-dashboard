// src/app/api/sensors/route.ts
import { NextResponse } from "next/server";
// Import the admin client
import { supabaseAdmin } from "@/lib/supabase-admin"; // Adjust path if needed

export async function POST(req: Request) {
  try {
    const { device_id, readings } = await req.json();

    if (!device_id) {
      return NextResponse.json({ error: "Missing device_id" }, { status: 400 });
    }

    // Type readings explicitly if possible for better safety
    const sensorData = readings.map((r: { metric: string, value: number }) => ({
      device_id,
      metric: r.metric,
      value: r.value,
    }));

    // Use the admin client for insertion
    const { error: insertError } = await supabaseAdmin
      .from('sensor_readings')
      .insert(sensorData);

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      throw insertError; // Re-throw to be caught by the outer try-catch
    }

    // Use the admin client for upsert
    const { error: upsertError } = await supabaseAdmin
      .from('device_status')
      .upsert({
        device_id,
        is_online: true,
        last_seen: new Date().toISOString()
      }, { onConflict: 'device_id' }); // Specify conflict column if needed

     if (upsertError) {
       console.error("Supabase upsert error:", upsertError);
       // Decide if this should be a fatal error for the request
       // throw upsertError;
     }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sensor API Error:", error);
    // Log the actual error for better debugging
    return NextResponse.json({ error: "Failed to store readings", details: (error as Error).message }, { status: 500 });
  }
}