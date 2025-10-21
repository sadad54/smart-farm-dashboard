interface Props {
  label: string;
  value: number | string;
  unit?: string;
  icon?: React.ReactNode;
}

export function SensorCard({ label, value, unit, icon }: Props) {
  return (
    <div className="flex flex-col items-center bg-white/70 rounded-2xl shadow-md p-4 w-36">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-gray-700 font-semibold">{label}</p>
      <p className="text-xl font-bold text-green-700">
        {value}
        <span className="text-sm font-medium ml-1">{unit}</span>
      </p>
    </div>
  );
}
