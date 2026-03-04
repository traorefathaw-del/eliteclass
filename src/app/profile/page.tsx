"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase";
import { Mail, Shield, Calendar, Award, Zap, Loader2, ShieldCheck, Activity, Fingerprint, Cpu, Power } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// 1. IMPORTATION DU TYPE USER DEPUIS LE SDK SUPABASE
import { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  // 2. TYPAGE EXPLICITE DU STATE : <User | null>
  // Cela autorise la variable à être nulle au début, puis à recevoir un objet User
  const [user, setUser] = useState<User | null>(null);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#060a13] gap-4">
      <div className="relative">
        <Loader2 className="animate-spin text-cyan-400" size={48} />
        <div className="absolute inset-0 blur-xl bg-cyan-400/20 animate-pulse" />
      </div>
      <span className="text-[10px] font-mono tracking-[0.5em] text-cyan-400/50 uppercase">Sync_Profile...</span>
    </div>
  );

  // Utilisation de l'optional chaining (?.) pour éviter les erreurs si user_metadata est vide
  const firstName = user?.user_metadata?.first_name || "Utilisateur";
  const lastName = user?.user_metadata?.last_name || "Elite";
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
  const isAdmin = user?.email === "traorefathaw@gmail.com";

  return (
    <div className="relative min-h-screen bg-[#060a13] text-white overflow-hidden selection:bg-cyan-500/30">
      
      {/* ATMOSPHÈRE NEURALE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-5xl mx-auto space-y-12 pt-24 pb-20 font-sans">
        
        {/* HEADER BIOMÉTRIQUE */}
        <header className="flex flex-col md:flex-row items-center gap-8 mb-16 relative">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2.8rem] blur opacity-25 group-hover:opacity-60 transition duration-1000" />
            <div className="relative w-36 h-36 bg-[#0d1424] border border-white/10 rounded-[2.5rem] flex items-center justify-center text-5xl font-black italic shadow-2xl text-cyan-400 overflow-hidden">
              <span className="relative z-10">{initials}</span>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_cyan] opacity-0 group-hover:opacity-100 group-hover:animate-scan z-20" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent -translate-y-full group-hover:animate-scan-slow" />
            </div>
            <div className="absolute -bottom-2 -right-2 p-3 bg-[#060a13] border border-white/10 rounded-2xl shadow-xl">
                <Fingerprint size={20} className="text-cyan-400" />
            </div>
          </motion.div>

          <div className="text-center md:text-left space-y-3 flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="h-[1px] w-8 bg-cyan-400/50" />
                <span className="text-cyan-400 font-mono text-[9px] tracking-[0.5em] uppercase">Status: Online</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-white leading-none">
              {firstName} {lastName}
            </h1>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em] flex items-center justify-center md:justify-start gap-2">
              <Cpu size={12} className={isAdmin ? "text-cyan-400" : "text-slate-700"} />
              {isAdmin ? "System_Root_Access" : "Verified_Operator"} • <span className="text-slate-700">#UID_{user?.id?.slice(0, 8)}</span>
            </p>
          </div>

          <button onClick={handleLogout} className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all group">
            <Power size={20} className="group-active:scale-90 transition-transform" />
          </button>
        </header>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Zap size={22} />, val: "0", label: "Points d'XP", color: "text-cyan-400" },
            { icon: <Award size={22} />, val: "0", label: "Badges", color: "text-blue-500" },
            { icon: <Calendar size={22} />, val: "0h", label: "Focus", color: "text-emerald-500" }
          ].map((stat, i) => (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} 
              className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col items-center group hover:border-cyan-500/30 transition-all"
            >
              <div className={`mb-4 p-3 bg-white/5 rounded-xl ${stat.color}`}>{stat.icon}</div>
              <span className="text-3xl font-black italic mb-1">{stat.val}</span>
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* REGISTRE DE DONNÉES */}
        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-10">
            <Activity className="text-cyan-400" size={20} />
            <h3 className="text-xl font-black italic uppercase tracking-widest">Paramètres_Système</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Credential_Access</p>
              <div className="bg-black/20 border border-white/5 p-4 rounded-xl text-xs font-bold text-slate-300 truncate">
                {user?.email}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Clearance_Level</p>
              <div className={`bg-black/20 border border-white/5 p-4 rounded-xl text-xs font-bold flex items-center gap-3 ${isAdmin ? "text-yellow-500" : "text-cyan-400"}`}>
                {isAdmin ? <ShieldCheck size={16} /> : <Shield size={16} />}
                {isAdmin ? "SUPER_ADMIN" : "STANDARD_UNIT"}
              </div>
            </div>
          </div>

          <button className="mt-10 w-full py-4 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all">
              Update_Identity_Matrix
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-70px); }
          100% { transform: translateY(70px); }
        }
        @keyframes scan-slow {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan { animation: scan 2s linear infinite; }
        .animate-scan-slow { animation: scan-slow 3s linear infinite; }
      `}</style>
    </div>
  );
}
