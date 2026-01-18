"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase";
import { 
  LayoutDashboard, BookOpen, Library, 
  Users, UserCircle, Settings, LogOut, Terminal,
  FlaskConical 
} from "lucide-react";

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: "Tableau de bord", href: "/dashboard" },
  { icon: <BookOpen size={20} />, label: "Mes cours", href: "/courses" },
  { 
    icon: <FlaskConical size={20} />, 
    label: "Elite Lab", 
    href: "/lab" 
  },
  { icon: <Library size={20} />, label: "Bibliothèque", href: "/library" },
  { icon: <Users size={20} />, label: "Communauté", href: "/forum" },
  { icon: <UserCircle size={20} />, label: "Mon compte", href: "/profile" },
  { icon: <Settings size={20} />, label: "Paramètres", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-64 h-screen bg-[#0a0f1a] border-r border-white/5 flex flex-col p-6 sticky top-0 selection:bg-[#22d3ee]/30">
      {/* LOGO SECTION */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-8 h-8 bg-[#22d3ee] rounded-lg flex items-center justify-center shadow-lg shadow-[#22d3ee]/20">
          <Terminal size={18} className="text-[#0a0f1a]" />
        </div>
        <span className="text-lg font-black italic tracking-tighter text-white uppercase font-sans">
          Elite<span className="text-[#22d3ee]">Class</span>
        </span>
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.15em] group ${
                isActive 
                  ? "bg-[#22d3ee] text-[#0a0f1a] shadow-lg shadow-[#22d3ee]/10" 
                  : "text-slate-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`transition-colors ${isActive ? "text-[#0a0f1a]" : "text-slate-500 group-hover:text-[#22d3ee]"}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER / SIGNOUT */}
      <button 
        onClick={handleSignOut}
        className="mt-auto flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest group"
      >
        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
        Déconnexion
      </button>
    </aside>
  );
}
