const frames = ["1D", "1W", "1M", "3M", "1Y", "MAX"];

export default function TimeframeSelector() {
  return (
    <div className="flex gap-2">
      {frames.map(f => (
        <button
          key={f}
          className="px-3 py-1 rounded-md text-sm bg-[#141722] text-zinc-400 hover:bg-[#1B1F2E] hover:text-white"
        >
          {f}
        </button>
      ))}
    </div>
  );
}
