"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart3,
  Star,
} from "lucide-react";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Watchlist",
    href: "/watchlist",
    icon: Star,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#0B0D12] border-r border-zinc-800 px-4 py-6">
      {/* Logo */}
      <div className="text-xl font-semibold text-white mb-8">
        QuantOS
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map(({ name, href, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
