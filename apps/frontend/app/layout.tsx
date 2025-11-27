import "./globals.css";
import type { Metadata } from "next";
import Topbar from "@/components/layout/Topbar";


export const metadata: Metadata = {
  title: "QuantOS Dashboard",
  description: "Finance dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0C10] text-gray-200">
        <Topbar />
        <main className="px-6 py-4">{children}</main>
      </body>
    </html>
  );
}
