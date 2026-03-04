"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, Trophy, Target, Zap, Clock, ChevronRight, Star, Activity } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase";

export default function DashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  
  // CORRECTION : On utilise 'badgeCount' ici pour correspondre à la mise à jour plus bas
  const [progression, setProgression] = useState({
    xp: 0,
    lessonsCompleted: 0,
    badgeCount: 0 
  });

  useEffect(() => {
    async function getProfileData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profile')
            .select('xp, completed_lessons')
            .eq('id', user.id)
            .maybeSingle();

          if (data) {
            const lessonsCount = data.completed_lessons ? data.completed_lessons.length : 0;
            // La mise à jour correspond maintenant à la structure du state
            setProgression({
              xp: data.xp || 0,
              lessonsCompleted: lessonsCount,
              badgeCount: Math.floor(lessonsCount / 5) 
            });
          }
        }
      } catch (error) {
        console.error("Erreur de synchronisation :", error);
      } finally {
        setLoading(false);
      }
    }

    getProfileData();
  }, []);

  const stats = [
    { 
      label: "Cours terminés", 
      value: progression.lessonsCompleted.toString(), 
      icon: <BookOpen className={progression.lessonsCompleted > 0 ? "text-cyan-400" : "text-slate-400"} />, 
      color: progression.lessonsCompleted > 0 ? "bg-cyan-400/10" : "bg-slate-500/10" 
    },
    { 
      label: "Points d'XP", 
      value: progression.xp.toString(), 
      icon: <Zap className={progression.xp > 0 ? "text-yellow-400" : "text-slate-400"} />, 
      color: progression.xp > 0 ? "bg-yellow-400/10" : "bg-slate-500/10" 
    },
    { 
      label: "Badges acquis", 
      // CORRECTION : Utilisation de progression.badgeCount directement
      value: progression.badgeCount.toString(), 
      icon: <Trophy className={progression.badgeCount > 0 ? "text-orange-400" : "text-slate-400"} />, 
      color: progression.badgeCount > 0 ? "bg-orange-500/10" : "bg-slate-500/10" 
    },
    { 
      label: "Heures de focus", 
      value: "0h", 
      icon: <Clock className="text-emerald-500" />, 
      color: "bg-emerald-500/10" 
    },
  ];

  const level = Math.floor(progression.xp / 500) + 1;
  const progressToNextLevel = (progression.xp % 500) / 5; 

  if (loading) return (
    <div className="min-h-screen bg-[#060a13] flex items-center justify-center">
        <Activity className="text-cyan-400 animate-pulse" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060a13] text-white p-6 pt-24 selection:bg-cyan-500/30 overflow-hidden relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-8 bg-cyan-400" />
              <span className="text-cyan-400 font-mono text-[9px] tracking-[0.4em] uppercase">
                Status: {progression.lessonsCompleted > 0 ? "Actif" : "Inactif"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-none text-white">
              Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Elite</span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 bg-white/[0.03] backdrop-blur-md p-3 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group"
          >
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-black text-cyan-400 border border-white/10">
              {level}
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                Niveau <Activity size={10} className="text-cyan-400 animate-pulse" />
              </p>
              <div className="w-32 h-1.5 bg-slate-800/50 rounded-full mt-1.5 overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full" 
                />
              </div>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden group cursor-default"
            >
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-4 relative z-10 transition-all`}>
                {stat.icon}
              </div>
              <p className="text-3xl font-black italic relative z-10 tracking-tighter">{stat.value}</p>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] relative z-10">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xs font-black flex items-center gap-3 italic uppercase tracking-[0.3em] text-cyan-400/80">
              <Target size={14} className="animate-spin-slow" /> Mission Prioritaire
            </h2>
            <motion.div className="relative group overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0d1424] p-8 flex flex-col md:flex-row gap-8 items-center transition-all shadow-2xl">
              <div className="w-full md:w-56 aspect-video bg-slate-900/50 rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden">
                <BookOpen size={40} className={progression.lessonsCompleted > 0 ? "text-cyan-500/40" : "text-slate-800"} />
              </div>

              <div className="flex-1 text-center md:text-left relative">
                <h3 className="text-2xl font-black mb-3 leading-tight text-white uppercase italic tracking-tighter">
                  {progression.lessonsCompleted > 0 ? "Poursuivre le cursus" : "Initialisation du cursus"}
                </h3>
                <p className="text-slate-400 text-xs mb-8 font-medium leading-relaxed max-w-sm">
                  {progression.lessonsCompleted > 0 
                    ? `Vous avez déjà validé ${progression.lessonsCompleted} étapes. Vos données sont synchronisées avec le Cloud Elite.`
                    : "Le système est prêt. Branchez-vous au flux de connaissances pour débloquer votre plein potentiel."}
                </p>
                <Link href="/lab"> 
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34,211,238,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-cyan-400 text-[#060a13] px-10 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 mx-auto md:mx-0"
                  >
                    {progression.lessonsCompleted > 0 ? "Continuer" : "Démarrer maintenant"} <ChevronRight size={16} />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xs font-black italic flex items-center gap-3 uppercase tracking-[0.3em] text-slate-500">
              <Star size={14} /> Arsenal
            </h2>
            <div className="bg-[#0d1424] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
               <div className="grid grid-cols-2 gap-6 relative z-10">
                 {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-3 transition-all ${
                        progression.lessonsCompleted >= (i * 5) 
                        ? "bg-cyan-500/20 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
                        : "bg-slate-900/80 border-dashed border-white/10 grayscale opacity-30"
                      }`}>
                        <Trophy size={24} className={progression.lessonsCompleted >= (i * 5) ? "text-cyan-400" : "text-slate-600"} />
                      </div>
                      <div className={`h-1 w-4 rounded-full ${progression.lessonsCompleted >= (i * 5) ? "bg-cyan-500" : "bg-slate-800"}`} />
                   </div>
                 ))}
               </div>
               
               <div className="mt-10 pt-8 border-t border-white/5 text-center">
                 <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] italic">
                   {progression.badgeCount > 0 
                    ? `// ${progression.badgeCount} BADGE(S) RÉCUPÉRÉ(S)` 
                    : "// En attente de données cloud"}
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%) scaleX(0.5); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(500%) scaleX(1); opacity: 0; }
        }
        .animate-scan { animation: scan 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
      `}</style>
    </div>
  );
}
