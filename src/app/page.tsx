"use client";
import { motion } from "framer-motion";
import { 
  MessageSquare, Users, Star, ArrowRight, 
  Code, Shield, Zap, Globe, CheckCircle2, 
  Terminal, Sparkles 
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
      
      {/* 1. NAVBAR FIXE */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Terminal size={18} className="text-white" />
          </div>
          <div className="text-xl font-black tracking-tighter italic uppercase">
            ELITE<span className="text-blue-500">CLASS</span>
          </div>
        </div>
        
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <a href="#features" className="hover:text-blue-500 transition-colors">Avantages</a>
          <a href="#forum" className="hover:text-blue-500 transition-colors">Communauté</a>
          <a href="#mentors" className="hover:text-blue-500 transition-colors">Mentors</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest px-4">
            Connexion
          </Link>
          <Link href="/signup" className="text-[10px] font-black bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-tighter shadow-xl shadow-blue-600/20">
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20">
        {/* Glow de fond */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.15),transparent)] z-0" />
        
        <motion.div {...fadeUp} className="z-10 text-center px-4 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
            <Sparkles size={12} /> Système d'apprentissage v1.0
          </div>
          
          <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-700 leading-none uppercase">
            ELITE<br/><span className="text-blue-600 italic">MINDSET.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-12 font-medium leading-relaxed">
            L'excellence n'est pas un acte, mais une habitude. Dominez le code et forgez votre avenir avec la communauté la plus sélective.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link href="/signup">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-12 py-6 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-white/5 flex items-center gap-3"
              >
                Rejoindre l'élite <ArrowRight size={20} />
              </motion.button>
            </Link>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800" />
              ))}
              <div className="pl-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                +500 Étudiants actifs
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. SECTION AVANTAGES */}
      <section id="features" className="py-32 px-6 relative border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <Zap />, title: "Apprentissage Rapide", desc: "Des parcours optimisés pour ne jamais perdre de temps." },
            { icon: <Users />, title: "Mentorat Direct", desc: "Échangez en temps réel avec des experts du domaine." },
            { icon: <Shield />, title: "Certifications", desc: "Vos compétences validées par des projets réels." },
            { icon: <Globe />, title: "Réseau Mondial", desc: "Connectez-vous avec des développeurs du monde entier." }
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-slate-900/30 border border-white/5 rounded-[2.5rem] hover:bg-blue-600/10 transition-all group"
            >
              <div className="text-blue-500 mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="font-bold text-xl mb-4 italic uppercase tracking-tighter">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. SECTION APERÇU DU FORUM */}
      <section id="forum" className="py-32 px-6 bg-slate-950/50">
        <div className="max-w-5xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-7xl font-black mb-6 italic uppercase tracking-tighter">LE FORUM.</h2>
          <p className="text-slate-500 font-mono text-xs tracking-[0.3em] uppercase underline underline-offset-8 decoration-blue-600">
            // Intelligence collective en temps réel
          </p>
        </div>
        <div className="max-w-4xl mx-auto space-y-4">
          {[
            "Comment configurer son environnement sur Ubuntu ?",
            "Les meilleures pratiques avec Supabase & Next.js",
            "Comment optimiser son code pour la production ?",
            "Partagez vos projets de la semaine"
          ].map((topic, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 15, backgroundColor: "rgba(30, 58, 138, 0.15)" }}
              className="p-8 border border-white/5 rounded-3xl flex items-center justify-between cursor-pointer transition-all bg-slate-900/20"
            >
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center font-bold text-blue-500 text-xl italic">#</div>
                <h3 className="font-bold text-lg">{topic}</h3>
              </div>
              <div className="hidden md:block text-[10px] text-slate-600 font-black uppercase tracking-widest">
                24 RÉPONSES
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. SECTION MENTORS */}
      <section id="mentors" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
              Apprenez des <br/><span className="text-blue-600">meilleurs.</span>
            </h2>
            <div className="h-px flex-1 bg-white/5 mx-10 mb-4 hidden md:block" />
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest italic">// Mentors certifiés</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah K.", role: "Senior Dev @Vercel", tech: "React & Next.js" },
              { name: "Alexandre L.", role: "Cloud Architect", tech: "AWS & Docker" },
              { name: "Moussa D.", role: "Fullstack Expert", tech: "Supabase & Postgres" }
            ].map((mentor, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -15 }}
                className="p-10 bg-slate-900/50 border border-white/5 rounded-[3rem] relative group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all">
                  <Star className="text-blue-500 fill-blue-500" size={24} />
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] mb-8 shadow-2xl shadow-blue-500/20" />
                <h4 className="text-2xl font-black mb-1 italic uppercase">{mentor.name}</h4>
                <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">{mentor.role}</p>
                <div className="flex items-center gap-3 text-slate-400 text-xs font-mono bg-black/30 w-fit px-4 py-2 rounded-full border border-white/5">
                  <CheckCircle2 size={14} className="text-emerald-500" /> {mentor.tech}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-40 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-5xl mx-auto p-20 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[4rem] relative overflow-hidden shadow-2xl shadow-blue-500/20"
        >
          <div className="relative z-10">
            <h2 className="text-5xl md:text-8xl font-black mb-10 italic uppercase tracking-tighter leading-none">Prêt pour <br/>l'excellence ?</h2>
            <Link href="/signup">
              <button className="bg-white text-black px-16 py-7 rounded-full font-black uppercase tracking-widest hover:bg-slate-200 transition-all text-sm shadow-2xl">
                Commencer l'aventure
              </button>
            </Link>
          </div>
          {/* Cercles de décor */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl -ml-20 -mb-20" />
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/5 text-center">
        <div className="text-slate-700 text-[9px] uppercase tracking-[1em] mb-4">
          Elite Classroom • Building the future • 2026
        </div>
        <div className="text-slate-800 text-[8px] font-mono tracking-widest uppercase">
          Propulsé par Next.js, Supabase et Framer Motion
        </div>
      </footer>
    </main>
  );
}
