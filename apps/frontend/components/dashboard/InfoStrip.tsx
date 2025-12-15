export default function InfoStrip() {
  return (
    <div className="flex items-center gap-6 text-sm text-zinc-300 py-3">
      <span className="font-semibold text-white">BTC</span>
      <span className="text-lg font-bold">$89,858</span>
      <span className="text-green-400">+2.1%</span>

      <span>
        RSI <span className="text-yellow-400">58</span>
        <span className="text-zinc-500 ml-1">(Neutral)</span>
      </span>

      <span className="text-zinc-500">1M</span>
    </div>
  );
}
