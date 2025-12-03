"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/layout/PageShell";

export default function Home() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://127.0.0.1:8000/news");
        const data = await res.json();
        setNews(data.articles || []);
      } catch (e) {
        console.error("Failed to load news", e);
      }
    }
    load();
  }, []);

  return (
    <PageShell>
      <div className="px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">🌍 Global Financial News</h1>

        <div className="grid grid-cols-3 gap-6">
          {news.map((n: any, i: number) => (
            <a
              key={i}
              href={n.url}
              target="_blank"
              className="bg-neutral-900 rounded-lg overflow-hidden hover:opacity-90 transition"
            >
              {n.image && (
                <img src={n.image} className="h-56 w-full object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-white line-clamp-2">
                  {n.title}
                </h3>

                <p className="text-gray-400 text-sm mt-2">
                  {n.source}
                </p>

                <p className="text-gray-500 text-xs mt-1">
                  {n.published}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
