import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";

// POST: Called by the dashboard to create a new command
export async function POST(req: Request) {
  try {
    const { device_id, command } = await req.json();

    if (!device_id || !command) {
      return NextResponse.json({ error: "Missing device_id or command" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('commands')
      .insert({ device_id, command, status: 'pending' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);

  } catch (error) {
    console.error("Command POST Error:", error);
    return NextResponse.json({ error: "Failed to issue command" }, { status: 500 });
  }
}

// GET: Called by the ESP32 to poll for new commands
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const device_id = searchParams.get("device_id");
  const status = searchParams.get("status") || "pending";

  const { data, error } = await supabase
    .from('commands')
    .select('*')
    .eq('device_id', device_id!)
    .eq('status', status)
    .order('created_at', { ascending: true }); // Oldest first

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// PATCH: Called by the ESP32 to acknowledge a command
export async function PATCH(req: Request) {
  try {
    const { command_id, status } = await req.json();

    const { error } = await supabase
      .from('commands')
      .update({ status, executed_at: new Date().toISOString() })
      .eq('id', command_id);

    if (error) throw error;
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Command PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update command" }, { status: 500 });
  }
}