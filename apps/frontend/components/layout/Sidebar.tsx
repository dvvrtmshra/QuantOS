"use client";

import { Home, BarChart3, Wallet, LineChart, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", icon: Home, href: "/" },              // <-- News Homepage
  { name: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { name: "Portfolio", icon: Wallet, href: "/portfolio" },
  { name: "Backtesting", icon: LineChart, href: "/backtesting" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-60 bg-[#0D0F14] border-r border-zinc-800 flex flex-col py-6">
      
      {/* Brand */}
      <div className="px-6 mb-6 text-xl font-bold text-white">
        QuantOS
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navLinks.map(({ name, icon: Icon, href }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-6 py-2 rounded-md text-sm
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-zinc-800"
                }
              `}
            >
              <Icon size={18} />
              {name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
