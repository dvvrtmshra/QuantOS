"use client";

import { ChevronDown } from "lucide-react";

const indicators = [
  "EMA Ribbon",
  "VWAP",
  "RSI",
  "MACD",
  "ATR",
  "Volume Profile",
];

export default function ChartControls() {
  return (
    <div className="flex items-center gap-3">
      <button className="px-3 py-1 rounded-md bg-[#1B1F2E] text-white text-sm">
        Candles
      </button>

      <button className="px-3 py-1 rounded-md bg-[#141722] text-zinc-400 text-sm">
        Line
      </button>

      <div className="relative group">
        <button className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#141722] text-zinc-400 text-sm">
          Indicators <ChevronDown className="w-4 h-4" />
        </button>

        <div className="absolute right-0 mt-2 w-52 bg-[#0F121A] border border-zinc-800 rounded-lg hidden group-hover:block">
          {indicators.map(ind => (
            <div
              key={ind}
              className="px-4 py-2 text-sm text-zinc-300 hover:bg-[#1B1F2E] cursor-pointer"
            >
              {ind}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
