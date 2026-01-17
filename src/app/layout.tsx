"use client";
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages où on ne veut PAS de menu latéral
  const noSidebarPages = ["/", "/login", "/signup", "/verify"];
  const showSidebar = !noSidebarPages.includes(pathname);

  return (
    <html lang="fr">
      <body className="bg-[#020617] text-white">
        <div className="flex min-h-screen">
          {showSidebar && <Sidebar />}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
