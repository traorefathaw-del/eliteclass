"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase"; 
import { 
  Library, LayoutDashboard, BookOpen, 
  UserCircle, Settings, LogOut, 
  FlaskConical, Dumbbell, 
  Menu, X, Youtube, Activity
} from "lucide-react";

export default function Sidebar({ user }: { user?: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh(); 
  };

  return (
    <>
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-transparent flex items-center justify-between px-4 md:px-8 z-[100]">
        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2.5 md:p-3 bg-white/5 rounded-xl text-cyan-400 hover:bg-cyan-400/10 transition-all border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.05)]"
          >
            <Menu size={20} />
          </button>
          
          <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
            <div className={`w-1.5 h-1.5 rounded-full ${user ? "bg-emerald-500 animate-pulse" : "bg-slate-500"}`} />
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Connecté</span>
          </div>
        </div>

        {/* Le bloc de droite (avatar/nom) a été supprimé ici */}
      </nav>

      {/* --- SIDEBAR --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[115]"
            />

            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed left-0 top-0 h-screen w-[280px] sm:w-[320px] bg-white/[0.02] backdrop-blur-[40px] border-r border-white/5 flex flex-col z-[120] will-change-transform"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

              <div className="relative z-10 px-8 py-10 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                    Elite<span className="text-cyan-400">Class</span>
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                      <Activity size={10} className="text-cyan-500" />
                      <span className="text-[7px] font-bold text-slate-500 tracking-[0.4em] uppercase">Kernel_Interface</span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <nav className="relative z-10 flex-1 px-6 space-y-1 overflow-y-auto custom-scrollbar pb-10">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                      <div className={`flex items-center gap-4 px-5 py-3 rounded-2xl transition-all border group ${
                        isActive 
                        ? "bg-cyan-400/10 border-cyan-400/30 text-white shadow-[0_0_20px_rgba(34,211,238,0.1)]" 
                        : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                      }`}>
                        <div className={`${isActive ? "text-cyan-400" : "group-hover:text-cyan-400"} transition-colors shrink-0`}>
                          {item.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] italic truncate">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-white/5">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-red-500/5 transition-all group active:scale-95"
                  >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">DECONNECTION</span>
                  </button>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const menuItems = [
  { icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/dashboard" },
  { icon: <BookOpen size={18} />, label: "Mes cours", href: "/courses" },
  { icon: <Library size={18} />, label: "Bibliothèque", href: "/library" },
  { icon: <Youtube size={18} />, label: "YouTube", href: "/youtube" },
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
  
  { icon: <FlaskConical size={18} />, label: "Elite Lab", href: "/lab" },
  { icon: <Dumbbell size={18} />, label: "Exercices", href: "/exercice" },
  { icon: <UserCircle size={18} />, label: "Mon compte", href: "/profile" },
  { icon: <Settings size={18} />, label: "Paramètres", href: "/settings" },
];
