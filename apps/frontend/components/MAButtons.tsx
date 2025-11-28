"use client";

interface Props {
  ma20: boolean;
  ma50: boolean;
  onChange: (key: "ma20" | "ma50") => void;
}

export default function MAButtons({ ma20, ma50, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">

      <button
        className={`px-3 py-1 rounded ${
          ma20 ? "bg-emerald-600" : "bg-neutral-800"
        }`}
        onClick={() => onChange("ma20")}
      >
        SMA20
      </button>

      <button
        className={`px-3 py-1 rounded ${
          ma50 ? "bg-purple-600" : "bg-neutral-800"
        }`}
        onClick={() => onChange("ma50")}
      >
        SMA50
      </button>

    </div>
  );
}
