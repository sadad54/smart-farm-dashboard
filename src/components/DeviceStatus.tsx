// src/components/DeviceStatus.tsx
export function DeviceStatus({ lastTs }: { lastTs: number | undefined }) {
  const isOnline = lastTs && (Date.now() - lastTs < 10000); // Online if data received in last 10s

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
       <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 ${
         isOnline 
           ? "bg-green-100 text-green-800" 
           : "bg-gray-100 text-gray-600 animate-pulse"
       }`}>
        <span className={`block w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`}></span>
        {isOnline ? "Device Online" : "Connecting..."}
      </span>
    </div>
  );
}