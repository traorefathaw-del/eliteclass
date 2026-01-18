"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  Dumbbell, Sparkles, BrainCircuit, Loader2, 
  CheckCircle2, Code2, ChevronRight, Zap, ChevronDown 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExercicePage() {
  const [loading, setLoading] = useState(false);
  const [exercice, setExercice] = useState<any>(null);
  const [selection, setSelection] = useState({ lang: "JavaScript", level: "Facile" });

  const handleGenerate = async () => {
    setLoading(true);
    
    // Récupération de la clé depuis .env.local
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    // Endpoint utilisant gemini-2.5-flash (validé sur ton compte)
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `Génère un exercice de programmation.
    Langage: ${selection.lang}
    Difficulté: ${selection.level}
    Réponds UNIQUEMENT avec ce format JSON strict :
    {
      "titre": "Nom de l'exercice",
      "description": "Enoncé clair",
      "points": 150,
      "code": "Code de départ"
    }`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: "application/json",
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        // C'est ici que l'erreur "API key not valid" est captée
        throw new Error(data.error?.message || "Clé API manquante ou invalide");
      }

      const textResponse = data.candidates[0].content.parts[0].text;
      setExercice(JSON.parse(textResponse));

    } catch (error: any) {
      console.error("Erreur:", error);
      alert("Erreur Système: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0f1a] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(34,211,238,0.05)_0%,_rgba(10,15,26,1)_100%)] -z-10" />

      <div className="p-8 max-w-6xl mx-auto pt-24 space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 text-cyan-400 mb-2">
              <Dumbbell size={20} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Elite Next-Gen 3.0</span>
            </div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
              Forge<span className="text-cyan-400">.</span>
            </h1>
          </motion.div>
          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 backdrop-blur-md">
            <Zap size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="font-black italic text-xl uppercase tracking-widest">ACTIF</span>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
          <div className="p-2 relative group">
            <label className="text-[10px] font-black uppercase text-cyan-400/60 ml-4 mb-2 block tracking-widest">Technologie</label>
            <select 
              className="w-full bg-[#0a0f1a] border border-white/10 rounded-2xl p-4 text-white text-xs font-bold outline-none appearance-none"
              onChange={(e) => setSelection({...selection, lang: e.target.value})}
            >
              <option>JavaScript</option>
              <option>Python</option>
            </select>
            <ChevronDown size={14} className="absolute right-6 bottom-7 text-cyan-500" />
          </div>

          <div className="p-2 relative group">
            <label className="text-[10px] font-black uppercase text-cyan-400/60 ml-4 mb-2 block tracking-widest">Niveau</label>
            <select 
              className="w-full bg-[#0a0f1a] border border-white/10 rounded-2xl p-4 text-white text-xs font-bold outline-none appearance-none"
              onChange={(e) => setSelection({...selection, level: e.target.value})}
            >
              <option>Facile</option>
              <option>Elite</option>
            </select>
            <ChevronDown size={14} className="absolute right-6 bottom-7 text-cyan-500" />
          </div>

          <div className="md:col-span-2 p-2 flex items-end">
             <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full h-[56px] bg-gradient-to-r from-cyan-400 to-blue-600 text-[#0a0f1a] rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50 active:scale-95"
             >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18} /> Forger l'exercice</>}
             </button>
          </div>
        </section>

        <AnimatePresence mode="wait">
          {exercice && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white/5 border border-white/5 p-10 rounded-[3.5rem] backdrop-blur-2xl">
                <div className="p-4 bg-cyan-400/10 w-fit rounded-2xl text-cyan-400 mb-8"><BrainCircuit size={28} /></div>
                <h2 className="text-3xl font-black italic uppercase mb-6 tracking-tighter leading-none">{exercice.titre}</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">{exercice.description}</p>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <CheckCircle2 size={16} className="text-cyan-400" /> IA Gemini 2.5 Certifiée
                </div>
              </div>

              <div className="lg:col-span-2 bg-[#0a0f1a] border border-white/10 rounded-[3.5rem] flex flex-col overflow-hidden shadow-2xl">
                <div className="bg-white/5 p-5 border-b border-white/5 flex items-center gap-2">
                   <Code2 size={14} className="text-cyan-400" />
                   <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">output_code.ia</span>
                </div>
                <div className="flex-1 p-10 font-mono text-sm leading-relaxed overflow-x-auto bg-black/20">
                  <pre className="text-cyan-400/80"><code>{exercice.code}</code></pre>
                </div>
                <div className="p-8 bg-white/5 border-t border-white/5 flex justify-between items-center">
                   <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest italic">Ready for integration</span>
                   <Link 
                      href="/lab" 
                      onClick={() => localStorage.setItem("currentExercise", JSON.stringify(exercice))}
                      className="flex items-center gap-3 px-8 py-4 bg-cyan-400 text-[#0a0f1a] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg"
                   >
                      Lancer l'IDE <ChevronRight size={16} />
                   </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
