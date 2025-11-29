"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import SearchBar from "@/components/SearchBar";

import TimeframeButtons from "@/components/TimeframeButtons";
import ChartModeButtons from "@/components/ChartModeButtons";
import MAButtons from "@/components/MAButtons";
import MoreChartsMenu from "@/components/MoreChartsMenu";

import CandleChart from "@/components/charts/CandleChart";
import RSIChart from "@/components/charts/RSIChart";
import ForecastChart from "@/components/charts/ForecastChart";
import ForecastHorizonButtons from "@/components/ForecastHorizonButtons";

import { api } from "@/lib/api";

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
  const [symbol, setSymbol] = useState("BTC");
  const [timeframe, setTimeframe] = useState("1M");

  const [candles, setCandles] = useState([]);
  const [price, setPrice] = useState<number | null>(null);
  const [rsi, setRsi] = useState<number | null>(null);

  const [chartMode, setChartMode] =
    useState<"candle" | "line">("candle");

  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(false);

  const [activeCharts, setActiveCharts] = useState<string[]>([]);

  const [forecastHistory, setForecastHistory] = useState([]);
  const [forecastPoints, setForecastPoints] = useState([]);
  const [forecastHorizon, setForecastHorizon] = useState(30);

  // ======================================================
  // FETCH DATA
  // ======================================================
  useEffect(() => {
    async function load() {
      try {
        const { period, interval } = TIMEFRAMES[timeframe];

        const c = await api(
          `/candles?symbol=${symbol}&period=${period}&interval=${interval}`
        );
        setCandles(c);

        const p = await api(`/price?symbol=${symbol}`);
        setPrice(p.price);

        const r = await api(`/rsi?symbol=${symbol}`);
        setRsi(r.rsi);

        const f = await api(
          `/forecast?symbol=${symbol}&horizon=${forecastHorizon}`
        );
        setForecastHistory(f.history);
        setForecastPoints(f.forecast);
      } catch (e) {
        console.error("API Error:", e);
      }
    }
    load();
  }, [symbol, timeframe, forecastHorizon]);

  // ======================================================
  // Toggle extra chart (RSI, MACD later etc)
  // ======================================================
  function toggleChart(key: string) {
    setActiveCharts((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  }

  // ======================================================
  // UI
  // ======================================================
  return (
    <PageShell>
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">QuantOS Dashboard</h1>
        <SearchBar onSearch={(s) => setSymbol(s)} />
      </div>

      {/* ================= STATS ================= */}
      <section className="grid grid-cols-4 gap-4 mt-6">
        <StatCard label="Current Price">
          {price
            ? Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(price)
            : "—"}
        </StatCard>

        <StatCard label="RSI">
          {rsi !== null ? rsi.toFixed(2) : "—"}
        </StatCard>

        <StatCard label="Candles Loaded">
          {candles.length}
        </StatCard>

        <StatCard label="Symbol">
          {symbol}
        </StatCard>
      </section>

      {/* ================= CHART CONTROLS ================= */}
      {candles.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-3 items-center">

          <TimeframeButtons
            timeframe={timeframe}
            onChange={(tf) => setTimeframe(tf)}
          />

          <ChartModeButtons
            mode={chartMode}
            onChange={(m) => setChartMode(m)}
          />

          <MAButtons
            ma20={showMA20}
            ma50={showMA50}
            onChange={(k) => {
              if (k === "ma20") setShowMA20(!showMA20);
              if (k === "ma50") setShowMA50(!showMA50);
            }}
          />

          <MoreChartsMenu
            selected={activeCharts}
            onChange={toggleChart}
          />
        </div>
      )}

      {/* ================= MAIN PRICE CHART ================= */}
      {candles.length > 0 && (
        <div className="mt-10">
          <CandleChart
            data={candles}
            mode={chartMode}
            showMA20={showMA20}
            showMA50={showMA50}
          />
        </div>
      )}

      {/* ================= RSI CHART ================= */}
      {activeCharts.includes("rsi") && (
        <div className="mt-10">
          <RSIChart data={candles} />
        </div>
      )}

      {/* ================= FORECAST ================= */}
      {forecastHistory.length > 0 && forecastPoints.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">
              {forecastHorizon}-Day ML Forecast
            </h2>

            <ForecastHorizonButtons
              horizon={forecastHorizon}
              onChange={setForecastHorizon}
            />
          </div>

          <ForecastChart
            history={forecastHistory}
            forecast={forecastPoints}
          />
        </div>
      )}
    </PageShell>
  );
}


/* ------------------ Small Reusable Stat Card ------------------ */
function StatCard({ label, children }: any) {
  return (
    <div className="p-4 bg-neutral-900 rounded-lg">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="text-3xl font-semibold">{children}</p>
    </div>
  );
}
