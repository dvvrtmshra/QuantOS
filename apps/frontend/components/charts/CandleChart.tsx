"use client";

import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
} from "recharts";

export default function CandleChart({ data }: { data: any[] }) {
  const formatted = data.map((d) => ({
    ...d,
    wick: d.high - d.low,
    body: Math.abs(d.close - d.open),
    direction: d.close >= d.open ? "up" : "down",
  }));

  return (
    <ComposedChart width={900} height={380} data={formatted}>
      <CartesianGrid stroke="#333" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />

      {/* WICK */}
      <Bar dataKey="wick" fill="#999" barSize={2} />

      {/* BODY */}
      <Bar
        dataKey="body"
        fill="#16a34a"
        barSize={8}
        stroke="#16a34a"
      />
    </ComposedChart>
  );
}
