"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickData,
  LineData,
  IChartApi,
  UTCTimestamp,
} from "lightweight-charts";

interface Candle {
  time: number | string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Props {
  data: Candle[];
  mode?: "candle" | "line";       // <- NEW
  showMA20?: boolean;
  showMA50?: boolean;
}

export default function CandleChart({ data, mode = "candle", showMA20, showMA50 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    try {
      if (chartRef.current) chartRef.current.remove();
    } catch {}

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 460,
      layout: { background: { color: "#121212" }, textColor: "#e5e5e5" },
      grid: {
        vertLines: { color: "#2A2A2A" },
        horzLines: { color: "#2A2A2A" },
      },
      timeScale: {
        borderColor: "#2A2A2A",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "#2A2A2A",
      },
    });
    chartRef.current = chart;

    const formatted = data.map((c) => ({
      time: (
        typeof c.time === "string"
          ? Math.floor(new Date(c.time).getTime() / 1000)
          : c.time
      ) as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    })) as CandlestickData[];

    //---------------------------------------------------------------------
    //  Candlestick Mode
    //---------------------------------------------------------------------
    if (mode === "candle") {
      const candleSeries = chart.addCandlestickSeries({
        upColor: "#10b981",
        downColor: "#ef4444",
        borderUpColor: "#10b981",
        borderDownColor: "#ef4444",
        wickUpColor: "#10b981",
        wickDownColor: "#ef4444",
      });

      candleSeries.setData(formatted);
    }

    //---------------------------------------------------------------------
    //  Line Mode
    //---------------------------------------------------------------------
    if (mode === "line") {
      const series = chart.addLineSeries({
        color: "#00b4ff",
        lineWidth: 2,
      });

      const lineData: LineData[] = formatted.map((c) => ({
        time: c.time,
        value: c.close,
      }));

      series.setData(lineData);
    }

    //---------------------------------------------------------------------
    //  SMA Lines (work for both chart types)
    //---------------------------------------------------------------------
    const closes = formatted.map((c) => c.close);

    function SMA(vals: number[], period: number): number[] {
      const result: number[] = [];
      for (let i = 0; i < vals.length; i++) {
        if (i < period) {
          result.push(NaN);
          continue;
        }
        const slice = vals.slice(i - period, i);
        const avg = slice.reduce((a, b) => a + b, 0) / period;
        result.push(avg);
      }
      return result;
    }

    if (showMA20) {
      const ma20Series = chart.addLineSeries({
        color: "#00e5ff",
        lineWidth: 2,
      });

      ma20Series.setData(
        SMA(closes, 20).map((v, i) => ({
          time: formatted[i].time,
          value: v,
        }))
      );
    }

    if (showMA50) {
      const ma50Series = chart.addLineSeries({
        color: "#ffcb00",
        lineWidth: 2,
      });

      ma50Series.setData(
        SMA(closes, 50).map((v, i) => ({
          time: formatted[i].time,
          value: v,
        }))
      );
    }

    //---------------------------------------------------------------------
    // Resize handler
    //---------------------------------------------------------------------
    function handleResize() {
      if (chartRef.current && containerRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      try {
        chartRef.current?.remove();
      } catch {}
      chartRef.current = null;
    };
  }, [data, mode, showMA20, showMA50]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-neutral-900 rounded-lg p-2"
      style={{ height: 470 }}
    />
  );
}
