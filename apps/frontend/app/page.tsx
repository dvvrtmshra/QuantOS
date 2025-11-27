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

  // load data when symbol changes
  useEffect(() => {
    async function load() {
      try {
        const c = await api(`/candles?symbol=${symbol}`);
        const r = await api(`/rsi?symbol=${symbol}`);

        setCandles(c);
        setRsi(r.rsi);
      } catch (err) {
        console.error("API Error:", err);
      }
    }
    load();
  }, [symbol]);

  const currentPrice =
    candles?.length ? candles[candles.length - 1].close : null;

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">QuantOS Dashoard</h1>
        <SearchBar onSearch={(s) => setSymbol(s)} />
      </div>

      {/* Stat Cards */}
      <section className="grid grid-cols-4 gap-4 mt-6">
        
        {/* Current Price */}
        <div className="p-4 bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-400">Current Price</p>
          <p className="text-3xl font-semibold">
            {currentPrice ?? "—"}
          </p>
        </div>

        {/* RSI */}
        <div className="p-4 bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-400">RSI</p>
          <p className="text-3xl font-semibold">
            {rsi?.toFixed(2) ?? "—"}
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
