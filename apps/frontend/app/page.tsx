"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-bold mb-4">
        QuantOS
      </h1>

      <p className="text-neutral-400 mb-8 text-center max-w-xl">
        A quantitative trading dashboard for market analysis,
        forecasting, and decision support.
      </p>

      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-white font-medium"
        >
          Go to Dashboard
        </Link>

        <Link
          href="/news"
          className="px-6 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition text-white font-medium"
        >
          Market News
        </Link>
      </div>
    </main>
  );
}
