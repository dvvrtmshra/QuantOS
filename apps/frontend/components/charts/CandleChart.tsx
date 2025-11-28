"use client";

import { useEffect, useRef } from "react";
import {
    createChart,
    IChartApi,
    CandlestickData,
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
}

export default function CandleChart({ data }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!containerRef.current || data.length === 0) return;

        // 🔥 only destroy if chart exists (and not already disposed)
        if (chartRef.current) {
            try {
                chartRef.current.remove();
            } catch (e) {
                console.warn("Chart already disposed, skipping...");
            }
        }

        const chart = createChart(containerRef.current, {
            width: containerRef.current.clientWidth,
            height: 420,
            layout: {
                background: { color: "#121212" },
                textColor: "#e5e5e5",
            },
            grid: {
                vertLines: { color: "#2A2A2A" },
                horzLines: { color: "#2A2A2A" },
            },
            rightPriceScale: { borderColor: "#2A2A2A" },
            timeScale: {
                borderColor: "#2A2A2A",
                timeVisible: true,
            },
        });

        chartRef.current = chart;

        const series = chart.addCandlestickSeries({
            upColor: "#10b981",
            downColor: "#ef4444",
            borderUpColor: "#10b981",
            borderDownColor: "#ef4444",
            wickUpColor: "#10b981",
            wickDownColor: "#ef4444",
        });

        const formatted: CandlestickData[] = data.map((c) => ({
            time: (
                typeof c.time === "string"
                    ? Math.floor(new Date(c.time).getTime() / 1000)
                    : c.time
            ) as UTCTimestamp,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
        }));

        series.setData(formatted);

        function handleResize() {
            if (chartRef.current && containerRef.current) {
                chartRef.current.applyOptions({
                    width: containerRef.current.clientWidth,
                });
            }
        }

        window.addEventListener("resize", handleResize);

        // 🔥 proper cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            if (chartRef.current) {
                try {
                    chartRef.current.remove();
                } catch {}
                chartRef.current = null;
            }
        };
    }, [data]);

    return (
        <div
            ref={containerRef}
            className="w-full bg-neutral-900 rounded-lg p-2"
            style={{ height: 450 }}
        />
    );
}
