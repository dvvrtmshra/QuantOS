"use client";

import ReactECharts from "echarts-for-react";

interface Candle {
  timestamp: string;
  close: number;
}

// RSI calculation
function calcRSI(closes: number[], period = 14): number[] {
  let rsi = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);

    if (i >= period) {
      const avgGain = gains / period;
      const avgLoss = losses / period;
      const rs = avgGain / avgLoss;
      rsi.push(100 - 100 / (1 + rs));
    } else {
      rsi.push(null as any);
    }
  }

  return rsi;
}

export default function RSIChart({ data }: { data: Candle[] }) {
  if (!data || data.length === 0) return <p>No RSI data</p>;

  const timestamps = data.map((c) => c.timestamp);
  const closes = data.map((c) => c.close);
  const values = calcRSI(closes, 14);

  const option = {
    backgroundColor: "#0D0F14",
    xAxis: {
      type: "category",
      data: timestamps,
      axisLine: { lineStyle: { color: "#666" } },
      axisLabel: { color: "#ccc" },
    },
    yAxis: {
      min: 0,
      max: 100,
      axisLabel: { color: "#ccc" },
      splitLine: { lineStyle: { color: "#222" } },
    },
    series: [
      {
        type: "line",
        data: values,
        smooth: true,
        symbol: "none",
        lineStyle: { color: "#4CC9F0", width: 2 },
      },
      // 30 line
      {
        type: "line",
        data: Array(values.length).fill(30),
        symbol: "none",
        lineStyle: { color: "#00FF88", width: 1, type: "dashed" },
      },
      // 70 line
      {
        type: "line",
        data: Array(values.length).fill(70),
        symbol: "none",
        lineStyle: { color: "#FF4D4D", width: 1, type: "dashed" },
      },
    ],
    tooltip: {
      trigger: "axis",
    },
  };

  return (
    <div className="bg-neutral-900 p-4 rounded-xl">
      <ReactECharts option={option} style={{ height: 250 }} />
    </div>
  );
}
