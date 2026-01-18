"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase";
import { Mail, Shield, Calendar, Award, Zap, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    getProfile();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0a0f1a]">
      <Loader2 className="animate-spin text-[#22d3ee]" size={40} />
    </div>
  );

  const firstName = user?.user_metadata?.first_name || "Utilisateur";
  const lastName = user?.user_metadata?.last_name || "Elite";
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

  // VERIFICATION DU RANG ADMINISTRATEUR
  const isAdmin = user?.email === "traorefathaw@gmail.com";

  return (
    <div className="relative min-h-screen font-sans selection:bg-[#22d3ee]/30">
      {/* FOND FIGÉ */}
      <div className="fixed inset-0 bg-[#0a0f1a] -z-10" />

      <div className="p-8 max-w-5xl mx-auto space-y-8 pt-24 pb-12">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-center gap-6 mb-12">
          <div className="w-32 h-32 bg-[#111827] border border-white/10 rounded-[2.5rem] flex items-center justify-center text-4xl font-black italic shadow-2xl text-[#22d3ee]">
            {initials}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
              {firstName} {lastName}
            </h1>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] mt-2">
              {isAdmin ? "ADMINISTRATEUR SYSTÈME" : "NOUVEAU MEMBRE"} • ID: {user?.id?.slice(0, 8)}
            </p>
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Zap size={24} className={isAdmin ? "text-[#22d3ee]" : "text-slate-600"} />, val: "0", label: "Points d'XP" },
            { icon: <Award size={24} className={isAdmin ? "text-[#22d3ee]" : "text-slate-600"} />, val: "0", label: "Badges Acquis" },
            { icon: <Calendar size={24} className={isAdmin ? "text-[#22d3ee]" : "text-slate-600"} />, val: "0h", label: "Temps de Formation" }
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="p-8 bg-[#111827]/50 backdrop-blur-sm border border-white/5 rounded-[2.5rem] flex flex-col items-center text-center group hover:border-[#22d3ee]/20 transition-all"
            >
              <div className="mb-4 p-3 bg-white/5 rounded-2xl group-hover:bg-[#22d3ee]/10 transition-colors">
                {stat.icon}
              </div>
              <span className="text-3xl font-black italic text-white">{stat.val}</span>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-2">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* INFOS PERSONNELLES */}
        <div className="bg-[#111827]/50 backdrop-blur-sm border border-white/5 rounded-[3.5rem] p-10 space-y-8">
          <h3 className="text-xl font-black italic uppercase tracking-tighter border-b border-white/5 pb-6 text-white">
              Paramètres du Registre
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Identifiant de Connexion</p>
              <div className="flex items-center gap-3 text-white font-bold">
                <Mail size={18} className="text-[#22d3ee]" /> {user?.email}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Niveau de Sécurité</p>
              <div className={`flex items-center gap-3 font-bold ${isAdmin ? "text-yellow-500" : "text-white"}`}>
                {isAdmin ? (
                  <>
                    <ShieldCheck size={18} className="text-yellow-500" /> Administrateur
                  </>
                ) : (
                  <>
                    <Shield size={18} className="text-[#22d3ee]" /> Utilisateur Standard
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
