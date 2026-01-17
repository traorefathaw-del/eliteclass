"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase";
import { 
  LayoutDashboard, BookOpen, Library, 
  Users, UserCircle, Settings, LogOut, Terminal 
} from "lucide-react";

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: "Tableau de bord", href: "/dashboard" },
  { icon: <BookOpen size={20} />, label: "Mes cours", href: "/courses" },
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
    router.push("/"); // Redirige vers la landing page après déconnexion
    router.refresh(); // Force le rafraîchissement pour effacer les cookies
  };

  return (
    <aside className="w-64 h-screen bg-slate-950 border-r border-white/5 flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Terminal size={18} className="text-white" />
        </div>
        <span className="text-lg font-black italic tracking-tighter text-white uppercase">EliteClass</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-slate-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* BOUTON DÉCONNEXION ACTIF */}
      <button 
        onClick={handleSignOut}
        className="mt-auto flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black text-xs uppercase tracking-widest group"
      >
        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
        Déconnexion
      </button>
    </aside>
  );
}
