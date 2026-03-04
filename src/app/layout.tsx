"use client";
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Script from "next/script";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // On ajoute "/terms" pour que le menu disparaisse de cette page
  const noSidebarPages = ["/", "/login", "/signup", "/verify", "/terms"];
  const showSidebar = !noSidebarPages.includes(pathname);

  return (
    <html lang="fr">
      <head>
        <Script 
          src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js" 
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-[#020617] text-white overflow-x-hidden">
        <div className="flex flex-col min-h-screen w-full">
          {/* La Sidebar (Navbar) ne s'affiche que si showSidebar est vrai */}
          {showSidebar && (
             <Sidebar />
          )}
          
          <main className={`w-full flex-1 ${showSidebar ? "pt-20 md:pt-24" : ""}`}>
            {/* Le padding-top (pt-20) n'est appliqué que si la barre est présente.
               Sur /terms, le contenu commencera tout en haut de l'écran.
            */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
