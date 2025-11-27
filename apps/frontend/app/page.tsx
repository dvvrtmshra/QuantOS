import { api } from "../lib/api";

export default async function Page() {
  const candles = await api("/candles");
  const rsi = await api("/rsi");

  return (
    <main className="p-6 space-y-6 text-white">
      <h1 className="text-3xl font-bold">QuantOS Dashboard</h1>

      <section className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-400">RSI</p>
          <p className="text-2xl font-semibold">{rsi.rsi.toFixed(2)}</p>
        </div>

        <div className="p-4 bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-400">Candles Loaded</p>
          <p className="text-2xl font-semibold">{candles.length}</p>
        </div>

        <div className="p-4 bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-400">Symbol</p>
          <p className="text-2xl font-semibold">BTC</p>
        </div>
      </section>

      <section className="bg-neutral-900 p-4 rounded-lg mt-8">
        <p>Candle Data:</p>
        <pre className="text-xs">{JSON.stringify(candles[0], null, 2)}</pre>
      </section>
    </main>
  );
}
