"use client";

interface Props {
  horizon: number;
  onChange: (h: number) => void;
}

const OPTIONS = [10, 15, 30];

export default function ForecastHorizonButtons({ horizon, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      {OPTIONS.map((h) => (
        <button
          key={h}
          onClick={() => onChange(h)}
          className={`px-3 py-1 rounded text-sm ${
            horizon === h
              ? "bg-emerald-600 text-white"
              : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          }`}
        >
          {h} days
        </button>
      ))}
    </div>
  );
}
