"use client";
import { useState } from "react";

interface Props {
  label: string;
  command: object;
}

export function CommandButton({ label, command }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch("/api/issue-command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        device_id: process.env.NEXT_PUBLIC_DEVICE_ID,
        command
      })
    });
    setLoading(false);
    if (res.ok) alert("✅ Command sent!");
  }

  return (
    <button
      disabled={loading}
      onClick={handleClick}
      className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50"
    >
      {loading ? "..." : label}
    </button>
  );
}
