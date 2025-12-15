import "./globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0D12] text-white">
        
        {children}
      </body>
    </html>
  );
}
