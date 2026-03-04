"use client";
import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, ShieldCheck, Scale, FileText, 
  Ban, Lock, Terminal, Database, AlertTriangle 
} from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-300 font-sans p-4 md:p-12 selection:bg-[#22d3ee]/30 selection:text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Header de navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
        >
          <Link 
            href="/signup" 
            className="flex items-center gap-2 text-[#22d3ee] hover:text-white transition-colors group text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Retour à l'enregistrement
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#22d3ee]/10 rounded-lg border border-[#22d3ee]/20">
              <ShieldCheck size={20} className="text-[#22d3ee]" />
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">Elite_Contract</h1>
          </div>
        </motion.div>

        {/* Corps du contrat */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111827]/50 border border-white/5 rounded-[2.5rem] p-6 md:p-12 backdrop-blur-xl relative overflow-hidden shadow-2xl"
        >
          {/* Ligne néon décorative */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#22d3ee]/40 to-transparent" />

          <div className="space-y-12">
            
            {/* 1. Acceptation */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <FileText size={18} className="text-[#22d3ee]" />
                <h2 className="text-sm font-black uppercase tracking-widest italic">01. Acceptation des Conditions</h2>
              </div>
              <p className="text-xs leading-relaxed text-slate-400 ml-7">
                L'accès et l'utilisation du forum EliteClass sont soumis à l'acceptation pleine et entière des présentes conditions. En créant un compte, l'utilisateur reconnaît avoir pris connaissance de ce contrat.
              </p>
            </section>

            {/* 2. Kernel_Interface */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <Lock size={18} className="text-[#22d3ee]" />
                <h2 className="text-sm font-black uppercase tracking-widest italic">02. Accès au "FORUM"</h2>
              </div>
              <div className="ml-7 space-y-4 text-xs text-slate-400">
                <p><strong className="text-[#22d3ee]">Sécurité :</strong> L'utilisateur est responsable de la confidentialité de ses identifiants. Toute action effectuée depuis son compte est réputée être de son fait.</p>
                <p><strong className="text-[#22d3ee]">Usage personnel :</strong> L'accès est strictement personnel. Le partage de compte pour accéder aux cours ou au "Elite Lab" est interdit.</p>
              </div>
            </section>

            {/* 3. Règles de Conduite */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <Terminal size={18} className="text-[#22d3ee]" />
                <h2 className="text-sm font-black uppercase tracking-widest italic">03. Règles de Conduite et Code</h2>
              </div>
              <p className="text-xs text-slate-400 ml-7 mb-2 italic">Le forum est un espace d'entraide. Sont strictement interdits :</p>
              <ul className="ml-7 space-y-3">
                {[
                  { label: "Malveillance", desc: "Le partage de scripts malveillants (malware, outils de phishing, etc.)." },
                  { label: "Plagiat", desc: "L'appropriation du code d'autrui sans citation." },
                  { label: "Comportement", desc: "Les insultes, le harcèlement ou toute forme de discrimination." },
                  { label: "Spam", desc: "La publicité non sollicitée pour d'autres services." }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]" />
                    <span className="text-slate-400"><b className="text-white uppercase text-[10px]">{item.label} :</b> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4. Propriété Intellectuelle */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <Database size={18} className="text-[#22d3ee]" />
                <h2 className="text-sm font-black uppercase tracking-widest italic">04. Propriété Intellectuelle</h2>
              </div>
              <div className="ml-7 space-y-4 text-xs text-slate-400">
                <p><b className="text-[#22d3ee]">Contenu EliteClass :</b> Les vidéos, supports de cours et l'interface du site restent la propriété exclusive d'EliteClass.</p>
                <p><b className="text-[#22d3ee]">Contenu Utilisateur :</b> En postant du code ou des solutions sur le forum, l'utilisateur accorde à EliteClass une licence non-exclusive pour afficher et conserver ce contenu.</p>
              </div>
            </section>

            {/* 5. Elite Lab */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <Scale size={18} className="text-[#22d3ee]" />
                <h2 className="text-sm font-black uppercase tracking-widest italic">05. Utilisation du "Elite Lab"</h2>
              </div>
              <p className="text-xs text-slate-400 ml-7 italic">L'utilisateur s'engage à ne pas utiliser les outils de simulation pour :</p>
              <ul className="ml-7 space-y-2 text-xs text-slate-400">
                <li className="flex gap-2"><span>—</span> Tenter de s'introduire dans l'infrastructure du serveur.</li>
                <li className="flex gap-2"><span>—</span> Exécuter des processus de minage de cryptomonnaies.</li>
                <li className="flex gap-2"><span>—</span> Effectuer des attaques par déni de service (DDoS).</li>
              </ul>
            </section>

            {/* 6. Responsabilité */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <AlertTriangle size={18} className="text-[#22d3ee]" />
                <h2 className="text-sm font-black uppercase tracking-widest italic">06. Limitation de Responsabilité</h2>
              </div>
              <ul className="ml-7 space-y-2 text-xs text-slate-400">
                <li className="flex gap-2"><span>—</span> Des erreurs ou bugs dans le code partagé par les membres.</li>
                <li className="flex gap-2"><span>—</span> Des pertes de données liées à l'utilisation du "Lab".</li>
                <li className="flex gap-2"><span>—</span> Des interruptions temporaires de service pour maintenance.</li>
              </ul>
            </section>

            {/* 7. Sanctions */}
            <section className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <Ban size={18} />
                <h2 className="text-sm font-black uppercase tracking-widest italic">07. Sanctions (Le "Bannissement")</h2>
              </div>
              <p className="text-xs leading-relaxed text-red-400/80">
                Toute violation de ces règles pourra entraîner un avertissement, une suspension temporaire ou une suppression définitive du compte (Ban) sans préavis ni remboursement des abonnements en cours.
              </p>
            </section>

          </div>

          <footer className="mt-16 pt-8 border-t border-white/5 text-center">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
              Protocol_Applied 
            </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
