// src/components/ActionTimeline.tsx
export function ActionTimeline({ items }: { items: { icon: string; text: string; t: number }[] }) {
  return (
    <div className="bg-white/70 rounded-2xl shadow-md p-4 w-full">
      <h2 className="font-semibold mb-3 text-gray-700">🕒 Action Timeline</h2>
      <ul className="space-y-2 h-32 overflow-y-auto pr-2">
        {items.length === 0 && <li className="text-sm text-gray-400">No actions yet. Let&apos;s start a mission!</li>}
        {items.slice(-6).reverse().map((item, idx) => (
          <li key={idx} className="flex items-center gap-3 text-sm text-gray-800 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span className="text-lg">{item.icon}</span>
            <span>{item.text}</span>
            <span className="ml-auto text-xs text-gray-400">{new Date(item.t).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}