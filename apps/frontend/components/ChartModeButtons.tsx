"use client";

interface Props {
  mode: "candle" | "line";
  onChange: (m: "candle" | "line") => void;
}

export default function ChartModeButtons({ mode, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">

      <button
        className={`px-3 py-1 rounded ${
          mode === "candle" ? "bg-blue-600" : "bg-neutral-800"
        }`}
        onClick={() => onChange("candle")}
      >
        Candlestick
      </button>

      <button
        className={`px-3 py-1 rounded ${
          mode === "line" ? "bg-blue-600" : "bg-neutral-800"
        }`}
        onClick={() => onChange("line")}
      >
        Line
      </button>

    </div>
  );
}
