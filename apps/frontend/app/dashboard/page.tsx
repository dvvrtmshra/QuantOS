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

// ===================== TIMEFRAMES =====================
const TIMEFRAMES: Record<string, { period: string; interval: string }> = {
  "1D": { period: "5d", interval: "30m" },
  "1M": { period: "1mo", interval: "1d" },
  "3M": { period: "3mo", interval: "1d" },
  "6M": { period: "6mo", interval: "1d" },
  "1Y": { period: "1y", interval: "1d" },
  "5Y": { period: "5y", interval: "1wk" },
  "MAX": { period: "max", interval: "1wk" },
};

export default function Dashboard() {
  // ===================== CORE STATE =====================
  const [symbol, setSymbol] = useState("BTC");
  const [timeframe, setTimeframe] = useState("1M");
  const [chartMode, setChartMode] = useState<"candle" | "line">("candle");

  // ===================== MARKET DATA =====================
  const [candles, setCandles] = useState<any[]>([]);
  const [price, setPrice] = useState<number | null>(null);
  const [rsi, setRsi] = useState<number | null>(null);

  // ===================== INDICATORS =====================
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(false);
  const [activeCharts, setActiveCharts] = useState<string[]>([]);

  // ===================== ML FORECAST =====================
  const [forecastHistory, setForecastHistory] = useState<any[]>([]);
  const [forecastPoints, setForecastPoints] = useState<any[]>([]);
  const [forecastHorizon, setForecastHorizon] = useState(30);

  // ===================== FETCH DATA =====================
  useEffect(() => {
    async function fetchData() {
      try {
        const { period, interval } = TIMEFRAMES[timeframe];

        const candlesData = await api(
          `/candles?symbol=${symbol}&period=${period}&interval=${interval}`
        );
        setCandles(candlesData);

        const priceData = await api(`/price?symbol=${symbol}`);
        setPrice(priceData.price);

        const rsiData = await api(`/rsi?symbol=${symbol}`);
        setRsi(rsiData.rsi);

        const forecastData = await api(
          `/forecast?symbol=${symbol}&horizon=${forecastHorizon}`
        );
        setForecastHistory(forecastData.history);
        setForecastPoints(forecastData.forecast);
      } catch (e) {
        console.error("API Error:", e);
      }
    }

    fetchData();
  }, [symbol, timeframe, forecastHorizon]);

const searchParams = new URLSearchParams(window.location.search);
const s = searchParams.get("symbol");
if (s) setSymbol(s);

  // ===================== TOGGLE CHARTS =====================
  function toggleChart(key: string) {
    setActiveCharts((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  }

  // ===================== UI =====================
  return (
    <PageShell>
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">QuantOS</h1>
        <SearchBar onSearch={setSymbol} />
      </div>

      {/* ===== Stats ===== */}
      <section className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Price">
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

        <StatCard label="Candles">
          {candles.length}
        </StatCard>

        <StatCard label="Symbol">
          {symbol}
        </StatCard>
      </section>

      {/* ===== Control Bar ===== */}
{candles.length > 0 && (
  <div className="mt-6 flex flex-col gap-3">

    {/* Row 1 — Timeframes (Primary) */}
    <div className="flex items-center">
      <TimeframeButtons
        timeframe={timeframe}
        onChange={setTimeframe}
      />
    </div>

   {/* Row — Chart Controls */}
<div className="flex items-center gap-2 h-9">
  <ChartModeButtons
    mode={chartMode}
    onChange={setChartMode}
  />

  <MoreChartsMenu
    selected={activeCharts}
    onChange={toggleChart}
  />
</div>


  </div>
)}

      {/* ===== Main Chart ===== */}
      {candles.length > 0 && (
        <div className="mb-10">
          <CandleChart
            data={candles}
            mode={chartMode}
            showMA20={showMA20}
            showMA50={showMA50}
          />
        </div>
      )}

      {/* ===== RSI ===== */}
      {activeCharts.includes("rsi") && (
        <div className="mb-10">
          <RSIChart data={candles} />
        </div>
      )}

      {/* ===== Forecast ===== */}
      {forecastHistory.length > 0 && forecastPoints.length > 0 && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
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

// ===================== Stat Card =====================
function StatCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 bg-neutral-900 rounded-lg">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="text-2xl font-semibold">{children}</p>
    </div>
  );
}
