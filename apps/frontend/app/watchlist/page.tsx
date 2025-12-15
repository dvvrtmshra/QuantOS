"use client";

import { useEffect, useState } from "react";
import { removeFromWatchlist, getWatchlist } from "@/lib/watchlist";
import Link from "next/link";

export default function WatchlistPage() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    setList(getWatchlist());
  }, []);

  function remove(symbol: string) {
    removeFromWatchlist(symbol);
    setList(getWatchlist());
  }

  return (
    <main className="px-6 py-6">
      <h1 className="text-3xl font-semibold mb-6">
        Watchlist
      </h1>

      {list.length === 0 && (
        <p className="text-neutral-400">
          No stocks in your watchlist yet.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {list.map((item) => (
          <div
            key={item.symbol}
            className="flex items-center justify-between bg-neutral-900 px-4 py-3 rounded-lg"
          >
            <Link
              href={`/dashboard?symbol=${item.symbol}`}
              className="font-medium text-white"
            >
              {item.symbol}
            </Link>

            <button
              onClick={() => remove(item.symbol)}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
