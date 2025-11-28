"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  LineData,
  UTCTimestamp,
} from "lightweight-charts";

interface Point {
  time: number;   // unix seconds
  close: number;
}

interface Props {
  history: Point[];
  forecast: Point[];
}

export default function ForecastChart({ history, forecast }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current || history.length === 0) return;

    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch {}
      chartRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: "#111" }, textColor: "#e5e5e5" },
      grid: {
        vertLines: { color: "#222" },
        horzLines: { color: "#222" },
      },
      timeScale: {
        borderColor: "#333",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "#333",
      },
    });

    chartRef.current = chart;

    const historySeries = chart.addLineSeries({
      color: "#22c55e",
      lineWidth: 2,
    });

    const forecastSeries = chart.addLineSeries({
      color: "#3b82f6",
      lineWidth: 2,
    });

    const historyData: LineData[] = history.map((p) => ({
      time: p.time as UTCTimestamp,
      value: p.close,
    }));

    const forecastData: LineData[] = forecast.map((p) => ({
      time: p.time as UTCTimestamp,
      value: p.close,
    }));

    historySeries.setData(historyData);
    forecastSeries.setData(forecastData);

    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch {}
        chartRef.current = null;
      }
    };
  }, [history, forecast]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-neutral-900 rounded-lg p-2"
      style={{ height: 420 }}
    />
  );
}
