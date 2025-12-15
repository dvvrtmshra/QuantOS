"use client";

import { useState } from "react";

interface Props {
  selected: string[];
  onChange: (key: string) => void;
}

const OPTIONS = [
  { key: "rsi", label: "RSI Chart" },
  { key: "ma20", label: "SMA 20" },
  { key: "ma50", label: "SMA 50" },
  { key: "forecast", label: "ML Forecast" },
];

export default function MoreChartsMenu({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* BUTTON */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          h-9
          px-4
          inline-flex
          items-center
          gap-1
          rounded-md
          bg-neutral-800
          text-sm
          text-neutral-200
          hover:bg-neutral-700
          focus:outline-none
        "
      >
        More Charts
        <span className="text-xs leading-none">▾</span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute
            left-0
            top-full
            mt-2
            w-48
            rounded-md
            bg-neutral-900
            border
            border-neutral-700
            shadow-lg
            z-10
            p-1
          "
        >
          {OPTIONS.map((opt) => {
            const isSelected = selected.includes(opt.key);

            return (
              <button
                key={opt.key}
                onClick={() => onChange(opt.key)}
                className={`
                  w-full
                  text-left
                  px-3
                  py-2
                  rounded
                  text-sm
                  transition
                  ${
                    isSelected
                      ? "bg-emerald-600 text-white"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }
                `}
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
