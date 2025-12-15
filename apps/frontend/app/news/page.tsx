"use client";

import { useEffect, useState } from "react";

import PageShell from "@/components/layout/PageShell";
import { api } from "@/lib/api";

type NewsItem = {
  title: string;
  url: string;
  image?: string;
  source?: string;
  published?: string;
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await api("/news");
        setNews(data.articles || []);
      } catch (e) {
        console.error("Failed to load news", e);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  return (
    <PageShell>
      <main className="px-6 py-6">
        <h1 className="text-3xl font-semibold mb-6">
          Global Financial News
        </h1>

        {loading && (
          <p className="text-neutral-400">Loading news…</p>
        )}

        {!loading && news.length === 0 && (
          <p className="text-neutral-400">No news available.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {news.map((n, i) => (
            <a
              key={i}
              href={n.url}
              target="_blank"
              rel="noreferrer"
              className="bg-neutral-900 rounded-lg overflow-hidden hover:opacity-90 transition"
            >
              {n.image && (
                <img
                  src={n.image}
                  alt={n.title}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-4">
                <h3 className="font-semibold text-lg text-white line-clamp-2">
                  {n.title}
                </h3>

                <div className="mt-2 text-sm text-neutral-400 flex justify-between">
                  <span>{n.source || "Unknown"}</span>
                  <span>{n.published || ""}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
