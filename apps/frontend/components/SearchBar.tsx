"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { addToWatchlist } from "@/lib/watchlist";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (symbol: string) => void;
}) {
  const [value, setValue] = useState("");

  function handleAdd() {
    if (!value) return;
    addToWatchlist(value.toUpperCase());
    alert(`${value.toUpperCase()} added to Watchlist`);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        placeholder="Search BTC, AMZN, AAPL…"
        className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sm outline-none"
      />

      <button
        onClick={() => onSearch(value)}
        className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm"
      >
        Search
      </button>

      <button
        onClick={handleAdd}
        title="Add to Watchlist"
        className="px-2 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700"
      >
        <Star className="w-4 h-4 text-yellow-400" />
      </button>
    </div>
  );
}
