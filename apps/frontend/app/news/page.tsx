"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api("/news");
        setNews(data.articles);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Global Finance News</h1>

      {loading && <p className="text-neutral-400">Fetching market news…</p>}

      <div className="grid grid-cols-3 gap-6">
        {news.map((n, i) => (
          <a
            key={i}
            href={n.url}
            target="_blank"
            className="bg-neutral-900 hover:bg-neutral-800 rounded-lg p-4 block"
          >
            {n.image && (
              <img
                src={n.image}
                className="w-full h-44 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="font-semibold line-clamp-2">{n.title}</h3>
            <p className="text-sm mt-2 text-neutral-400">
              {n.source}
            </p>
            <p className="text-xs mt-1 text-neutral-500">
              {new Date(n.published).toLocaleString()}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
