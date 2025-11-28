"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import CandleChart from "@/components/charts/CandleChart";
import RSIChart from "@/components/charts/RSIChart";
import SearchBar from "@/components/SearchBar";
import TimeframeButtons from "@/components/TimeframeButtons";
import MAButtons from "@/components/MAButtons"; // 🔥 ADD THIS
import { api } from "@/lib/api";
import ChartModeButtons from "@/components/ChartModeButtons";


const TIMEFRAMES = {
  "1D": { period: "5d", interval: "30m" },
  "1M": { period: "1mo", interval: "1d" },
  "3M": { period: "3mo", interval: "1d" },
  "6M": { period: "6mo", interval: "1d" },
  "1Y": { period: "1y", interval: "1d" },
  "5Y": { period: "5y", interval: "1wk" },
  "MAX": { period: "max", interval: "1wk" },
};

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("1M");
  const [symbol, setSymbol] = useState("BTC");
  const [candles, setCandles] = useState([]);
  const [rsi, setRsi] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  // MA toggles
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(false);

  const [chartMode, setChartMode] = useState<"candle" | "line">("candle");


  useEffect(() => {
    async function load() {
      try {
        const { period, interval } = TIMEFRAMES[timeframe];

        // ---- candles ----
        const c = await api(
          `/candles?symbol=${symbol}&period=${period}&interval=${interval}`
        );
        setCandles(c);

        // ---- RSI ----
        const r = await api(`/rsi?symbol=${symbol}`);
        setRsi(r.rsi);

        // ---- live price ----
        const p = await api(`/price?symbol=${symbol}`);
        setPrice(p.price);

      } catch (err) {
        console.error("API Error:", err);
      }
    }

    load();
  }, [symbol, timeframe]); // 🔥 timeframe must update chart

  return (
    <PageShell>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">QuantOS Dashboard</h1>
        <SearchBar onSearch={(s) => setSymbol(s)} />
      </div>

      {/* 📊 Stats */}
      <section className="grid grid-cols-4 gap-4 mt-6">
        
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

        <div className="p-4 bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-400">RSI</p>
          <p className="text-3xl font-semibold">
            {rsi !== null ? rsi.toFixed(2) : "—"}
          </p>
        </div>

        <div className="p-4 bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-400">Candles Loaded</p>
          <p className="text-3xl font-semibold">{candles.length}</p>
        </div>

        <div className="p-4 bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-400">Symbol</p>
          <p className="text-3xl font-semibold">{symbol}</p>
        </div>
      </section>

      {/* 📈 Chart Section */}
      {candles.length > 0 && (
        <>
          <div className="mt-10">
            
            {/* TIMEFRAMES */}
            <TimeframeButtons
              timeframe={timeframe}
              onChange={(tf) => setTimeframe(tf)}
            />

            <ChartModeButtons
              mode={chartMode}
              onChange={(m) => setChartMode(m)}
            />



            {/* MA TOGGLES */}
            <MAButtons
              ma20={showMA20}
              ma50={showMA50}
              onChange={(k) => {
                if (k === "ma20") setShowMA20(!showMA20);
                if (k === "ma50") setShowMA50(!showMA50);
              }}
            />

            {/* MAIN CHART */}
            <CandleChart
              data={candles}
              mode={chartMode}
              showMA20={showMA20}
              showMA50={showMA50}
            />


          </div>

          {/* RSI CHART */}
          <div className="mt-10">
            <RSIChart data={candles} />
          </div>
        </>
      )}
    </PageShell>
  );
}
