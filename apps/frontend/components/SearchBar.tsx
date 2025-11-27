"use client";

import { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (symbol: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <input
      className="bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-md text-sm w-80"
      placeholder="Search BTC, ETH, TSLA..."
      value={value}
      onChange={(e) => setValue(e.target.value.toUpperCase())}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSearch(value);
      }}
    />
  );
}
