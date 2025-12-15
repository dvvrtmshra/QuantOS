export type WatchItem = {
  symbol: string;
  addedAt: number;
};

const KEY = "quantos_watchlist";

export function getWatchlist(): WatchItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

export function addToWatchlist(symbol: string) {
  const list = getWatchlist();
  if (list.find(i => i.symbol === symbol)) return;

  const updated = [
    ...list,
    { symbol, addedAt: Date.now() },
  ];

  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function removeFromWatchlist(symbol: string) {
  const updated = getWatchlist().filter(i => i.symbol !== symbol);
  localStorage.setItem(KEY, JSON.stringify(updated));
}
