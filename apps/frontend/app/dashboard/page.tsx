"use client";

import { useEffect, useState, useMemo } from "react";

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
  // ===================== CORE STATE =====================
  const [symbol, setSymbol] = useState("BTC");
  const [timeframe, setTimeframe] = useState("1M");
  const [chartMode, setChartMode] = useState<"candle" | "line">("candle");

  // ===================== MARKET DATA =====================
  const [candles, setCandles] = useState<any[]>([]);
  const [price, setPrice] = useState<number | null>(null);
  const [rsi, setRsi] = useState<number | null>(null);

  // ===================== Indicators =====================
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(false);
  const [activeCharts, setActiveCharts] = useState<string[]>([]);

  // ===================== ML FORECAST =====================
  const [forecastHistory, setForecastHistory] = useState<any[]>([]);
  const [forecastPoints, setForecastPoints] = useState<any[]>([]);
  const [forecastHorizon, setForecastHorizon] = useState(30);


  // ==========================================================
  // ~ BACKEND DATA FETCH
  // ==========================================================
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
      } catch (error) {
        console.error("API Error:", error);
      }
    }

    fetchData();
  }, [symbol, timeframe, forecastHorizon]);


  // ==========================================================
  // ~ TOGGLE ADD-ON CHARTS
  // ==========================================================
  function toggleChart(key: string) {
    setActiveCharts((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  }


  // ==========================================================
  // UI RENDER
  // ==========================================================
  return (
    <PageShell>

      {/* ============= Header ============= */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">QuantOS Dashboard</h1>
        <SearchBar onSearch={setSymbol} />
      </div>


      {/* ============= STATS ============= */}
      <section className="grid grid-cols-4 gap-4 mt-4">
        <StatCard label="Current Price">
          {price ?
            Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
                .format(price)
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


      {/* ============= CONTROL BAR ============= */}
      {candles.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-3 items-center">

          <TimeframeButtons
            timeframe={timeframe}
            onChange={setTimeframe}
          />

          <ChartModeButtons
            mode={chartMode}
            onChange={setChartMode}
          />

          <MAButtons
            ma20={showMA20}
            ma50={showMA50}
            onChange={(key) => {
              if (key === "ma20") setShowMA20((p) => !p);
              if (key === "ma50") setShowMA50((p) => !p);
            }}
          />

          <MoreChartsMenu
            selected={activeCharts}
            onChange={toggleChart}
          />
        </div>
      )}


      {/* ============= MAIN PRICE CHART ============= */}
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


      {/* ============= RSI ============= */}
      {activeCharts.includes("rsi") && (
        <div className="mt-10">
          <RSIChart data={candles} />
        </div>
      )}


      {/* ============= FORECAST ============= */}
      {forecastHistory.length > 0 && forecastPoints.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
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



// ========================================================
// Small reusable stat card
// ========================================================
function StatCard({ label, children }: any) {
  return (
    <div className="p-4 bg-neutral-900 rounded-lg">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="text-3xl font-semibold">{children}</p>
    </div>
  );
}
