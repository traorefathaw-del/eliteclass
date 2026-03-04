"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Dumbbell, Sparkles, BrainCircuit, Loader2, 
  CheckCircle2, Code2, ChevronRight, Zap, ChevronDown, Eye, EyeOff 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExercicePage() {
  const [loading, setLoading] = useState(false);
  const [exercice, setExercice] = useState<any>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [selection, setSelection] = useState({ lang: "JavaScript", level: "Facile" });

  useEffect(() => {
    const savedExercise = localStorage.getItem("currentExercise");
    if (savedExercise) {
      setExercice(JSON.parse(savedExercise));
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setShowCorrection(false);
    
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `Génère un exercice de programmation aléatoire et unique.
    Langage: ${selection.lang}
    Difficulté: ${selection.level}
    Réponds UNIQUEMENT avec ce format JSON strict :
    {
      "titre": "Nom de l'exercice",
      "description": "Enoncé clair et précis",
      "points": 150,
      "code": "Code de départ avec commentaires",
      "correction": "Le code complet solutionné" 
    }`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Erreur API");

      const textResponse = data.candidates[0].content.parts[0].text;
      const parsedExercice = JSON.parse(textResponse);
      
      setExercice(parsedExercice);
      localStorage.setItem("currentExercise", JSON.stringify(parsedExercice));

    } catch (error: any) {
      console.error("Erreur:", error);
      alert("Erreur Système: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen bg-[#060a13] text-white p-4 sm:p-6 md:p-12 pt-24 md:pt-28 selection:bg-cyan-500/30 overflow-x-hidden relative">
      
      {/* BACKGROUND ATMOSPHÉRIQUE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-cyan-500/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER RESPONSIVE */}
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-8 bg-cyan-400" />
              <span className="text-cyan-400 font-mono text-[8px] md:text-[9px] tracking-[0.4em] uppercase opacity-70">Neural_Forge_v3</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none text-white">
              Forge<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">.</span>
            </h1>
          </motion.div>
          
          <div className="w-fit flex items-center gap-4 bg-white/[0.03] backdrop-blur-md p-3 px-6 rounded-2xl border border-white/5">
            <Zap size={18} className="text-yellow-500 fill-yellow-500 animate-pulse" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Générateur Actif</span>
          </div>
        </header>

        {/* SECTION SÉLECTEURS RESPONSIVE */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-4 bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-xl mb-12">
          <div className="p-2 relative group">
            <label className="text-[9px] md:text-[10px] font-black uppercase text-cyan-400/60 ml-4 mb-2 block tracking-widest">Technologie</label>
            <select 
              className="w-full bg-[#0a0f1a] border border-white/10 rounded-2xl p-4 text-white text-xs font-bold outline-none appearance-none"
              onChange={(e) => setSelection({...selection, lang: e.target.value})}
            >
              <option>JavaScript</option>
              <option>Python</option>
              <option>C</option>
            </select>
            <ChevronDown size={14} className="absolute right-6 bottom-7 text-cyan-500 pointer-events-none" />
          </div>

          <div className="p-2 relative group">
            <label className="text-[9px] md:text-[10px] font-black uppercase text-cyan-400/60 ml-4 mb-2 block tracking-widest">Niveau</label>
            <select 
              className="w-full bg-[#0a0f1a] border border-white/10 rounded-2xl p-4 text-white text-xs font-bold outline-none appearance-none"
              onChange={(e) => setSelection({...selection, level: e.target.value})}
            >
              <option>Facile</option>
              <option>Moyen</option>
              <option>Elite</option>
            </select>
            <ChevronDown size={14} className="absolute right-6 bottom-7 text-cyan-500 pointer-events-none" />
          </div>

          <div className="sm:col-span-2 p-2 flex items-end">
             <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full h-[56px] flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-[#0a0f1a] rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50 active:scale-95"
             >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18} /> Forger l'exercice</>}
             </button>
          </div>
        </section>

        {/* AFFICHAGE EXERCICE RESPONSIVE */}
        <AnimatePresence mode="wait">
          {exercice && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              {/* Carte Description */}
              <div className="lg:col-span-1 bg-white/5 border border-white/5 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] backdrop-blur-2xl">
                <div className="p-4 bg-cyan-400/10 w-fit rounded-2xl text-cyan-400 mb-6 md:mb-8">
                  <BrainCircuit className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black italic uppercase mb-4 md:mb-6 tracking-tighter leading-none">{exercice.titre}</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 md:mb-8">{exercice.description}</p>
                <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <CheckCircle2 size={16} className="text-cyan-400 shrink-0" /> IA Gemini 2.5 Certifiée
                </div>
              </div>

              {/* Bloc Code / Correction */}
              <div className="lg:col-span-2 bg-[#0a0f1a] border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col overflow-hidden shadow-2xl min-h-[400px]">
                <div className="bg-white/5 p-4 md:p-5 border-b border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-cyan-400" />
                      <span className="text-[9px] md:text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        {showCorrection ? "correction_active.ia" : "output_code.ia"}
                      </span>
                   </div>
                   <button 
                      onClick={() => setShowCorrection(!showCorrection)}
                      className="px-3 md:px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                   >
                      {showCorrection ? <><EyeOff size={12} /> Cacher</> : <><Eye size={12} /> Correction</>}
                   </button>
                </div>
                
                <div className="flex-1 p-6 md:p-10 font-mono text-xs md:text-sm leading-relaxed overflow-x-auto bg-black/20">
                  <pre className={`whitespace-pre-wrap md:whitespace-pre ${showCorrection ? "text-emerald-400/80" : "text-cyan-400/80"} transition-colors`}>
                    <code>{showCorrection ? exercice.correction : exercice.code}</code>
                  </pre>
                </div>

                <div className="p-6 md:p-8 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row gap-6 justify-between items-center text-center sm:text-left">
                   <span className="text-slate-500 text-[8px] md:text-[9px] uppercase font-bold tracking-widest italic">
                    {showCorrection ? "Mode Solution active" : "Ready for integration"}
                   </span>
                   <Link 
                      href="/lab" 
                      className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-cyan-400 text-[#0a0f1a] rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg"
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
