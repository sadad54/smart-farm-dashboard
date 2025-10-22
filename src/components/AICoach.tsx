// src/components/AICoach.tsx
export function AICoach({ soil, temp, hum, light }:{
  soil?: number; temp?: number; hum?: number; light?: number;
}) {
  const messages: string[] = [];
  // NOTE: The threshold for "dry" soil depends on your sensor. 
  // A raw value of >2500 is common for dry capacitive sensors. Adjust as needed.
  if (soil && soil > 2500) messages.push("The soil looks dry. Let's give our plant a drink! 💧");
  if (temp && temp > 30) messages.push("It’s getting warm in here. Try running the fan! 🌬️");
  if (light && light < 500) messages.push("It's a bit dark. The plant might like the grow light! 💡");
  
  const tip = messages[0] ?? "Everything looks great! What a happy plant. 🪴";

  return (
    <div className="w-11/12 md:w-2/3 bg-gradient-to-r from-green-50 to-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900 text-center shadow-sm">
      <span className="font-semibold text-lg">🤖 AI Coach says:</span>
      <p className="mt-1">{tip}</p>
    </div>
  );
}