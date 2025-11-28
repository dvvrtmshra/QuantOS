"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import CandleChart from "@/components/charts/CandleChart";
import RSIChart from "@/components/charts/RSIChart";
import SearchBar from "@/components/SearchBar";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [symbol, setSymbol] = useState("BTC");
  const [candles, setCandles] = useState<any[]>([]);
  const [rsi, setRsi] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // 🚀 Fetch historical candles
        const c = await api(`/candles?symbol=${symbol}`);
        setCandles(c);

        // 🚀 Fetch RSI
        const r = await api(`/rsi?symbol=${symbol}`);
        setRsi(r.rsi);

        // 🚀 Fetch Real-time Price
        const p = await api(`/price?symbol=${symbol}`);
        setPrice(p.price);
      } catch (err) {
        console.error("API Error:", err);
      }
    }

    load();
  }, [symbol]);

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">QuantOS Dashboard</h1>
        <SearchBar onSearch={(s) => setSymbol(s)} />
      </div>

      {/* Stat Cards */}
      <section className="grid grid-cols-4 gap-4 mt-6">
        
        {/* Current Price */}
        <div className="p-4 bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-400">Current Price</p>
          <p className="text-3xl font-semibold">
            {price
              ? Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(price)
              : "—"}
          </p>
        </div>

        {/* RSI */}
        <div className="p-4 bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-400">RSI</p>
          <p className="text-3xl font-semibold">
            {rsi !== null ? rsi.toFixed(2) : "—"}
          </p>
        </div>

        {/* Candle Count */}
        <div className="p-4 bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-400">Candles Loaded</p>
          <p className="text-3xl font-semibold">{candles.length}</p>
        </div>

        {/* Symbol */}
        <div className="p-4 bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-400">Symbol</p>
          <p className="text-3xl font-semibold">{symbol}</p>
        </div>
      </section>

      {/* Main Charts */}
      {candles.length > 0 && (
        <>
          <div className="mt-10">
            <CandleChart data={candles} />
          </div>

          <div className="mt-10">
            <RSIChart data={candles} />
          </div>
        </>
      )}
    </PageShell>
  );
}
