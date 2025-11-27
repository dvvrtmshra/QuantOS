"use client";

import { Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#0E0F13] border-b border-zinc-800">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold text-white tracking-wide">
          QuantOS
        </span>
      </div>

      {/* Middle: Search */}
      <div className="flex-1 max-w-md mx-10">
        <input
          type="text"
          placeholder="Search assets, tickers, portfolios..."
          className="w-full bg-zinc-900 text-sm text-gray-300 rounded-md px-4 py-2
                     border border-zinc-800 outline-none focus:border-blue-500"
        />
      </div>

      {/* Right: Bell + Avatar */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 transition">
          <Bell size={18} className="text-gray-300" />
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
      </div>
    </header>
  );
}
