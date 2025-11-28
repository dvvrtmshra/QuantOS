"use client";

interface Props {
  timeframe: string;
  onChange: (tf: string) => void;
}

const TF = ["1D", "1M", "3M", "6M", "1Y", "5Y", "MAX"];

export default function TimeframeButtons({ timeframe, onChange }: Props) {
  return (
    <div className="flex gap-2 mt-4">
      {TF.map((tf) => (
        <button
          key={tf}
          onClick={() => onChange(tf)}
          className={`px-3 py-1 text-sm rounded-md ${
            timeframe === tf
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          }`}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}
