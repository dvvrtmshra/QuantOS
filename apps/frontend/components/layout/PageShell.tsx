"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-screen bg-[#0B0C10] text-gray-200">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
