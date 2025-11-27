"use client";

import ReactECharts from "echarts-for-react";

interface Candle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// SMA calculation
function calcSMA(data: number[], period: number): number[] {
  const sma: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      sma.push(null as any); // no value before period
      continue;
    }
    const slice = data.slice(i - period, i);
    sma.push(slice.reduce((a, b) => a + b, 0) / period);
  }
  return sma;
}

export default function CandleChart({ data }: { data: Candle[] }) {
  if (!data || data.length === 0) return <p>No data</p>;

  const xAxis = data.map((c) => c.timestamp);
  const ohlc = data.map((c) => [c.open, c.close, c.low, c.high]);

  const closePrices = data.map((c) => c.close);

  // --- Calculate Moving Averages ---
  const ma20 = calcSMA(closePrices, 20);
  const ma50 = calcSMA(closePrices, 50);

  const option = {
    backgroundColor: "#0D0F14",

    tooltip: {
      trigger: "axis",
      backgroundColor: "#111",
      borderColor: "#333",
      textStyle: { color: "#eee" },
    },

    xAxis: {
      type: "category",
      data: xAxis,
      axisLine: { lineStyle: { color: "#666" } },
      axisLabel: { color: "#ccc" },
    },

    yAxis: {
      scale: true,
      axisLine: { lineStyle: { color: "#666" } },
      axisLabel: { color: "#ccc" },
      splitLine: { lineStyle: { color: "#222" } },
    },

    series: [
      {
        type: "candlestick",
        name: "Candles",
        data: ohlc,
        itemStyle: {
          color: "#0ECB81",
          color0: "#FF4976",
          borderColor: "#0ECB81",
          borderColor0: "#FF4976",
        },
      },

      // 🚀 MA20
      {
        name: "MA 20",
        type: "line",
        data: ma20,
        smooth: true,
        symbol: "none",
        lineStyle: { color: "#0ECB81", width: 1.6 },
      },

      // 🚀 MA50
      {
        name: "MA 50",
        type: "line",
        data: ma50,
        smooth: true,
        symbol: "none",
        lineStyle: { color: "#FFD700", width: 1.6 },
      },
    ],
  };

  return (
    <div className="bg-neutral-900 p-4 rounded-xl">
      <ReactECharts option={option} style={{ height: "450px" }} />
    </div>
  );
}
