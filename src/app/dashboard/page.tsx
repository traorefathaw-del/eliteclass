"use client";
import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, Trophy, Target, Zap, Clock, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // STATS RÉINITIALISÉES À 0 - COULEUR ACCENT : #22d3ee
  const stats = [
    { label: "Cours terminés", value: "0", icon: <BookOpen className="text-cyan-400" />, color: "bg-cyan-400/10" },
    { label: "Points d'XP", value: "0", icon: <Zap className="text-slate-500" />, color: "bg-slate-500/10" },
    { label: "Badges acquis", value: "0", icon: <Trophy className="text-slate-500" />, color: "bg-slate-500/10" },
    { label: "Heures de focus", value: "0h", icon: <Clock className="text-emerald-500" />, color: "bg-emerald-500/10" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6 pt-24 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER DYNAMIQUE */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter italic uppercase">Dashboard <span className="text-cyan-400">Elite</span></h1>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-mono text-[10px]">
                 <span className="text-white font-bold"></span>
            </p>
          </div>
          
          {/* NIVEAU RÉINITIALISÉ */}
          <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-white/5 shadow-2xl">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-black text-cyan-400 border border-white/5">
              ?
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Niveau 1</p>
              <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-cyan-400 w-0 rounded-full transition-all duration-1000" />
              </div>
            </div>
          </div>
        </header>

        {/* GRID DE STATS À 0 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-slate-900/40 border border-white/5 rounded-3xl group hover:border-cyan-400/20 transition-all"
            >
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-black italic">{stat.value}</p>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SECTION : FORMATION INITIALE */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-black flex items-center gap-2 italic uppercase tracking-widest text-cyan-400">
              <Target size={16} /> Objectif Recommandé
            </h2>
            <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#111827] p-8 flex flex-col md:flex-row gap-8 items-center transition-all hover:bg-slate-900/50">
              <div className="w-full md:w-48 aspect-video bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5">
                <BookOpen size={32} className="text-slate-700" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-black mb-2 leading-tight text-white uppercase italic">Commencer le cursus</h3>
                <p className="text-slate-500 text-xs mb-6 font-medium">Aucune progression détectée. Lancez votre première leçon pour activer vos statistiques.</p>
                <Link href="/courses">
                  <button className="bg-white text-black hover:bg-cyan-400 hover:text-[#0a0f1a] px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl">
                    Explorer les cours
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* SECTION : BADGES VIERGES */}
          <div className="space-y-6">
            <h2 className="text-sm font-black italic flex items-center gap-2 uppercase tracking-widest text-slate-500">
              <Star size={16} /> Récompenses
            </h2>
            <div className="bg-[#111827] border border-white/5 rounded-[2.5rem] p-8">
               <div className="grid grid-cols-2 gap-4">
                 {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="flex flex-col items-center group">
                      <div className="w-14 h-14 bg-slate-900 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-2 grayscale opacity-40 group-hover:opacity-100 transition-all">
                        <Trophy size={20} className="text-slate-700" />
                      </div>
                      <p className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">Verrouillé</p>
                   </div>
                 ))}
               </div>
               <p className="text-center text-[9px] text-slate-700 font-bold uppercase tracking-widest mt-8 italic">
                 // Accomplissez des défis pour débloquer
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
