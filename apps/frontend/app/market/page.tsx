"use client";

import { useEffect, useState } from "react";

export default function MarketPage() {
  const [symbol, setSymbol] = useState("TSLA");
  const [data, setData] = useState<any>(null);

  async function fetchData() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/market/history?symbol=${symbol}`
    );
    const json = await res.json();
    setData(json);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">QuantOS Market</h1>

      {data && (
        <div className="mt-6">
          <p className="text-lg">
            <b>{data.symbol}</b>:{" "}
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.last)}
          </p>
          <p>High: {data.high}</p>
          <p>Low: {data.low}</p>
        </div>
      )}
    </div>
  );
}
