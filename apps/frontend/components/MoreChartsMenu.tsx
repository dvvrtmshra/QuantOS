"use client";

import { useState } from "react";

interface Props {
  selected: string[];
  onChange: (key: string) => void;
}

const OPTIONS = [
  { key: "rsi", label: "RSI Chart" },
  // future: { key: "macd", label: "MACD" },
  // future: { key: "bb", label: "Bollinger Bands" },
];

export default function MoreChartsMenu({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1 bg-neutral-800 rounded-md text-gray-200 hover:bg-neutral-700"
      >
        More Charts ▾
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute mt-2 bg-neutral-900 border border-neutral-700 rounded-md shadow-lg z-10 p-2 w-48"
        >
          {OPTIONS.map((opt) => {
            const isSelected = selected.includes(opt.key);
            return (
              <button
                key={opt.key}
                onClick={() => onChange(opt.key)}
                className={`w-full text-left px-2 py-1 rounded ${
                  isSelected
                    ? "bg-emerald-600 text-white"
                    : "text-gray-300 hover:bg-neutral-800"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
