"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import { 
  MessageSquare, Users, Star, ArrowRight, 
  Shield, Zap, Globe, CheckCircle2, 
  Terminal, Sparkles, Activity, Cpu
} from "lucide-react";
import Link from "next/link";

// --- BACKGROUND COHÉRENT AVEC LES CHAPITRES ---
const SharedBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-500/10 blur-[100px] md:blur-[150px] animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/5 blur-[100px] md:blur-[150px]" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
  </div>
);

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <main className="min-h-screen bg-[#02040a] text-white selection:bg-cyan-500/30 font-sans overflow-x-hidden">
      <SharedBackground />
      
      {/* BARRE DE PROGRESSION STYLE CHAPITRE */}
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-[3px] bg-cyan-400 z-[100] shadow-[0_0_20px_#22d3ee]" />

      {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#02040a]/50 backdrop-blur-md px-4 md:px-6 py-4 md:py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/20">
            <Terminal className="text-[#02040a] w-4 h-4 md:w-[18px] md:h-[18px]" />
          </div>
          <div className="text-lg md:text-xl font-black tracking-tighter italic uppercase">
            ELITE<span className="text-cyan-400">CLASS</span>
          </div>
        </div>
        
        <div className="hidden lg:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <a href="#features" className="hover:text-cyan-400 transition-colors">AVANTAGES</a>
          <a href="#forum" className="hover:text-cyan-400 transition-colors">COMMUNAUTE</a>
          <a href="#mentors" className="hover:text-cyan-400 transition-colors">MENTORS</a>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/login" className="text-[9px] md:text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest px-2 md:px-4">
            CONNEXION
          </Link>
          <Link href="/signup" className="text-[9px] md:text-[10px] font-black bg-cyan-400 text-[#02040a] px-4 md:px-6 py-2 md:py-2.5 rounded-full hover:bg-white transition-all uppercase tracking-tighter shadow-xl shadow-cyan-400/20">
            S'INSCRIRE
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 md:pt-20 px-4">
        <motion.div {...fadeUp} className="z-10 text-center w-full max-w-6xl">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-cyan-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-6 md:mb-10">
            <Activity className="animate-pulse w-3 h-3" /> Neural_Learning_System v1.0
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black tracking-tighter mb-6 leading-[0.9] md:leading-[0.85] uppercase">
            ELITE <br/><span className="text-cyan-400 italic">MINDSET.</span>
          </h1>
          
          <motion.div 
            initial={{ width: 0 }} 
            whileInView={{ width: "120px" }} 
            className="h-[3px] md:h-[4px] bg-cyan-400 mx-auto mb-8 md:mb-12 shadow-[0_0_20px_#22d3ee]" 
          />
          
          <p className="max-w-xl md:max-w-2xl mx-auto text-slate-400 text-base md:text-xl mb-10 md:mb-12 font-medium leading-relaxed italic px-4">
            L'excellence n'est pas un acte, mais une habitude. Dominez le code et forgez votre avenir avec la communauté la plus sélective.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center">
            <Link href="/signup" className="w-full md:w-auto">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                className="w-full md:w-auto bg-white text-[#02040a] px-8 md:px-12 py-5 md:py-6 rounded-full font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:bg-cyan-400 transition-colors"
              >
                REJOINDRE LES ELITES <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            </Link>
            <div className="flex items-center gap-4 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#02040a] bg-slate-800" />
                ))}
              </div>
              <span>+500 Active_Nodes</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. SECTION AVANTAGES */}
      <section id="features" className="py-20 md:py-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: <Zap className="w-6 h-6" />, title: "Apprentissage", desc: "Flux de données optimisé pour une rétention maximale." },
            { icon: <Users className="w-6 h-6" />, title: "Mentorat", desc: "Accès direct au kernel des experts Senior." },
            { icon: <Shield className="w-6 h-6" />, title: "Certifications", desc: "Validation cryptographique de vos compétences." },
            { icon: <Globe className="w-6 h-6" />, title: "Network", desc: "Expansion de votre réseau de neurones professionnel." }
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 md:p-10 bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-xl hover:border-cyan-500/40 transition-all group"
            >
              <div className="text-cyan-500/50 mb-6 md:mb-8 group-hover:text-cyan-400 transition-colors">{feature.icon}</div>
              <h3 className="font-black text-lg md:text-xl mb-4 italic uppercase tracking-tighter text-slate-200">{feature.title}</h3>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">{feature.desc}</p>
              <div className="mt-8 h-[1px] w-full bg-white/5 overflow-hidden">
                <motion.div initial={{ x: "-100%" }} whileInView={{ x: "0%" }} transition={{ duration: 1.5 }} className="h-full bg-cyan-400/30" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. SECTION FORUM */}
      <section id="forum" className="py-20 md:py-32 px-6">
        <div className="max-w-5xl mx-auto text-center mb-16 md:mb-24">
          <span className="text-cyan-500 font-mono text-[9px] md:text-[10px] tracking-[0.5em] md:tracking-[0.8em] uppercase mb-4 block">Community_Kernel</span>
          <h2 className="text-4xl md:text-7xl lg:text-8xl font-black mb-6 italic uppercase tracking-tighter">LE FORUM.</h2>
          <div className="h-1 w-16 md:w-20 bg-cyan-400 mx-auto shadow-[0_0_20px_#22d3ee]" />
        </div>
        <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
          {[
            "Thread: Optimisation de la gestion mémoire en C",
            "Thread: Roadmap Python vers IA Architecture",
            "Thread: Debugging des listes chaînées complexes",
          ].map((topic, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 10, backgroundColor: "rgba(34, 211, 238, 0.05)" }}
              className="p-6 md:p-8 border border-white/5 rounded-2xl md:rounded-3xl flex items-center justify-between cursor-pointer transition-all bg-white/[0.02] backdrop-blur-sm group"
            >
              <div className="flex gap-4 md:gap-6 items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border border-white/10 flex items-center justify-center font-bold text-cyan-400 text-xs md:text-sm italic group-hover:border-cyan-500">
                  {i + 1}
                </div>
                <h3 className="font-bold text-sm md:text-lg text-slate-300 group-hover:text-white uppercase italic truncate max-w-[200px] md:max-w-none">{topic}</h3>
              </div>
              <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-slate-600 font-black uppercase tracking-widest shrink-0">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-500 animate-ping" /> <span className="hidden sm:inline">Synchronized</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. SECTION MENTORS */}
      <section id="mentors" className="py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-4 md:gap-8">
            <h2 className="text-4xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-none">
              Les <br className="md:hidden" /><span className="text-cyan-400">Architectes.</span>
            </h2>
            <div className="h-[1px] flex-1 bg-white/5 mx-10 mb-5 hidden lg:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              { name: "Fathaw T.", role: "Senior Kernel Dev", tech: "C & Python " },
              { name: "Sosthène K.", role: "Fullstack Architect", tech: "C & JavaScript" },
            ].map((mentor, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 md:p-12 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-8 md:mb-10">
                   <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-800 rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden group-hover:border-cyan-500/50 transition-colors" />
                   <Cpu className="w-7 h-7 md:w-8 md:h-8 text-white/10 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h4 className="text-2xl md:text-3xl font-black mb-1 italic uppercase tracking-tighter">{mentor.name}</h4>
                <p className="text-cyan-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-6 md:mb-8">{mentor.role}</p>
                <div className="flex items-center gap-3 text-slate-400 text-[10px] md:text-xs font-mono bg-black/40 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-white/5 w-fit">
                   <CheckCircle2 className="text-cyan-400 w-3 h-3 md:w-4 md:h-4" /> {mentor.tech}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-20 md:py-40 px-4 md:px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto p-12 md:p-24 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden shadow-2xl"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl lg:text-[8rem] font-black mb-8 md:mb-12 italic uppercase tracking-tighter leading-[0.9] text-white">
              PRÊT À <br/><span className="text-cyan-400">COMPILER ?</span>
            </h2>
            <Link href="/signup">
              <button className="w-full md:w-auto bg-cyan-400 text-[#02040a] px-10 md:px-16 py-6 md:py-8 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all text-xs md:text-sm shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                Initialize_Adventure.exe
              </button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-cyan-500/10 rounded-full blur-[80px] md:blur-[120px] -mr-20 md:-mr-32 -mt-20 md:-mt-32" />
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 md:py-20 border-t border-white/5 text-center relative z-10">
        <div className="text-slate-600 text-[7px] md:text-[9px] uppercase tracking-[0.5em] md:tracking-[1em] mb-4 font-black px-4">
          ELITE CLASSROOM • SYSTEM_2026 • STATUS_ONLINE
        </div>
      </footer>
    </main>
  );
}
