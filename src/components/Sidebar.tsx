"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, BookOpen, Library, 
  UserCircle, Settings, LogOut, 
  FlaskConical, Dumbbell, ChevronLeft,
  MessageSquare // Ajout de l'icône pour le chat
} from "lucide-react";

const menuItems = [
  { icon: <LayoutDashboard size={22} />, label: "Dashboard", href: "/dashboard" },
  { icon: <BookOpen size={22} />, label: "Mes cours", href: "/courses" },
  { icon: <FlaskConical size={22} />, label: "Elite Lab", href: "/lab" },
  { icon: <Dumbbell size={22} />, label: "Exercices", href: "/exercice" },
  { icon: <Library size={22} />, label: "Bibliothèque", href: "/library" },
  { 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    ), 
    label: "Communauté", 
    href: "/forum" 
  },
  // NOUVELLE SECTION : CHAT PRIVÉ
  { 
    icon: <MessageSquare size={22} />, 
    label: "Chat Privé", 
    href: "/chat" 
  },
  { icon: <UserCircle size={22} />, label: "Mon compte", href: "/profile" },
  { icon: <Settings size={22} />, label: "Paramètres", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Spacer pour le layout */}
      <div className={`transition-all duration-300 shrink-0 ${isCollapsed ? 'w-[100px]' : 'w-[280px]'}`} />

      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 100 : 280 }}
        className="fixed left-0 top-0 h-screen bg-[#0a0f1a] border-r border-[#22d3ee]/5 flex flex-col p-6 z-[100] overflow-hidden"
      >
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-0 top-12 w-8 h-12 bg-[#22d3ee]/10 hover:bg-[#22d3ee]/20 border-y border-l border-[#22d3ee]/20 rounded-l-xl flex items-center justify-center text-[#22d3ee] z-50 transition-colors"
        >
          <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
            <ChevronLeft size={16} strokeWidth={3} />
          </motion.div>
        </button>

        {/* HEADER */}
        <div className={`mb-16 px-2 h-10 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                Elite<span className="text-[#22d3ee]">Class</span>
              </span>
              <span className="text-[7px] font-bold text-[#22d3ee]/40 tracking-[0.5em] uppercase mt-1.5 ml-1">
                System v3.0
              </span>
            </motion.div>
          )}
          {isCollapsed && (
             <div className="w-8 h-1 bg-[#22d3ee]/20 rounded-full" /> 
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-2 px-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="block group">
                <div className={`flex items-center gap-5 px-4 py-4 rounded-2xl transition-all ${
                  isActive 
                  ? "text-white bg-[#22d3ee]/5 border border-[#22d3ee]/10" 
                  : "text-slate-500 hover:text-white"
                } ${isCollapsed ? 'justify-center' : ''}`}>
                  <div className={isActive ? "text-[#22d3ee]" : "group-hover:text-[#22d3ee]"}>
                    {item.icon}
                  </div>
                  {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER / DECONNEXION */}
        <div className="pt-6 mt-auto border-t border-[#22d3ee]/5">
          <Link href="/" className="block">
            <button className={`w-full flex items-center gap-5 px-4 py-4 rounded-2xl text-slate-600 hover:text-red-500 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
              <LogOut size={22} />
              {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Terminate</span>}
            </button>
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
