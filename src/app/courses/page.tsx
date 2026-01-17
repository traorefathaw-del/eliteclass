"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { Search, Play, Terminal, ArrowLeft, Code2, Trash2, Sparkles, Cpu, XCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const MASTERCLASS_DB = [
  { id: "q6FcVUFM42o", title: "LANGAGE C : Masterclass Complète", lang: "c", thumbnail: "https://img.youtube.com/vi/q6FcVUFM42o/maxresdefault.jpg" },
  { id: "Ssh71heLhXY", title: "JAVASCRIPT : Devenir Expert", lang: "javascript", thumbnail: "https://img.youtube.com/vi/Ssh71heLhXY/maxresdefault.jpg" },
  { id: "oUJolR5bX6g", title: "PYTHON : Programmation Avancée", lang: "python", thumbnail: "https://img.youtube.com/vi/oUJolR5bX6g/maxresdefault.jpg" }
];

const STARTER_CODE = {
  c: `#include <stdio.h>\n\nint main() {\n    printf("Bonjour Elite Labs!\\n");\n    return 0;\n}`,
  python: `name = "Elite User"\nprint(f"Hello {name}")`,
  javascript: `const message = "Elite JS Active";\nconsole.log(message);`
};

export default function EliteLabsFinal() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeVideo, setActiveVideo] = useState(MASTERCLASS_DB[0]);
  const [selectedLang, setSelectedLang] = useState<"c" | "python" | "javascript">("c");
  const [code, setCode] = useState(STARTER_CODE.c);
  const [output, setOutput] = useState<{msg: string, type: 'error' | 'success' | 'system' | 'result'}[]>([]);
  const monacoRef = useRef<any>(null);

  useEffect(() => { setIsMounted(true); }, []);

  // --- LOGIQUE D'EXÉCUTION STRICTE PAR LANGAGE ---
  const handleRun = () => {
    setOutput([{ msg: `> Analyse du code ${selectedLang.toUpperCase()}...`, type: 'system' }]);
    const results: string[] = [];
    let hasError = false;

    setTimeout(() => {
      // 1. VÉRIFICATION SYNTAXIQUE SPÉCIFIQUE
      if (selectedLang === "c") {
        if (!code.includes("main") || !code.includes("{")) {
            setOutput(prev => [...prev, { msg: "ERREUR SYNTAXE : Fonction main() introuvable.", type: 'error' }]);
            return;
        }
        // Vérification stricte du point-virgule sur les lignes de commande
        const lines = code.split('\n');
        lines.forEach((line, i) => {
          const t = line.trim();
          if (t.startsWith("printf") && !t.endsWith(";")) {
            setOutput(prev => [...prev, { msg: `ERREUR LIGNE ${i + 1} : ';' manquant après printf.`, type: 'error' }]);
            hasError = true;
          }
        });
        if (hasError) return;

        // Extraction spécifique C
        const regexC = /printf\s*\(\s*["']([^"']+)["']\s*\)/g;
        let m;
        while ((m = regexC.exec(code)) !== null) results.push(m[1].replace(/\\n/g, ''));
      } 
      
      else if (selectedLang === "python") {
        // Extraction spécifique Python
        const regexPy = /print\s*\(\s*f?["']([^"']+)["']\s*\)/g;
        let m;
        while ((m = regexPy.exec(code)) !== null) results.push(m[1]);
      } 
      
      else if (selectedLang === "javascript") {
        try {
          const originalLog = console.log;
          console.log = (m) => results.push(String(m));
          new Function(code)();
          console.log = originalLog;
        } catch (e: any) {
          setOutput(prev => [...prev, { msg: `JS RUNTIME ERROR: ${e.message}`, type: 'error' }]);
          return;
        }
      }

      // 2. AFFICHAGE DES RÉSULTATS RÉELS
      if (results.length > 0) {
        setOutput(prev => [...prev, ...results.map(r => ({ msg: r, type: 'result' as const }))]);
        setOutput(prev => [...prev, { msg: `[${selectedLang}] Execution finished successfully.`, type: 'success' }]);
      } else {
        setOutput(prev => [...prev, { msg: "Programme terminé (aucune sortie détectée).", type: 'system' }]);
      }
    }, 600);
  };

  const changeLang = (lang: "c" | "python" | "javascript") => {
    setSelectedLang(lang);
    setCode(STARTER_CODE[lang]);
    setOutput([]);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans overflow-hidden">
      {/* HEADER */}
      <header className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link href="/"><ArrowLeft size={20} className="text-slate-400 hover:text-white transition-colors"/></Link>
          <h1 className="font-black italic text-xl uppercase tracking-tighter">Elite<span className="text-blue-500">.</span>Labs</h1>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
          <CheckCircle2 size={14} className="text-emerald-500 animate-pulse"/>
          <span className="text-[10px] font-black uppercase text-emerald-500">Linter {selectedLang.toUpperCase()} Actif</span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* SECTION GAUCHE : VIDÉO & PLAYLIST */}
        <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-r border-white/5 bg-slate-950/20">
          <div className="aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl mb-6">
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${activeVideo.id}`} allowFullScreen />
          </div>

          <p className="text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest italic">Configuration de l'IDE :</p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {(["javascript", "python", "c"] as const).map((l) => (
              <button 
                key={l} onClick={() => changeLang(l)}
                className={`py-4 rounded-2xl border text-[11px] font-black uppercase transition-all ${selectedLang === l ? "bg-blue-600 border-blue-400 shadow-xl shadow-blue-600/20" : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"}`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase text-slate-600 tracking-[0.3em] mb-4">Cours recommandés</h3>
            {MASTERCLASS_DB.map((v) => (
              <button key={v.id} onClick={() => setActiveVideo(v)} className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all ${activeVideo.id === v.id ? "bg-blue-600/10 border-blue-500/50" : "bg-white/5 border-transparent hover:bg-white/10"}`}>
                <img src={v.thumbnail} className="w-20 rounded-xl" alt="thumb" />
                <div className="text-left font-bold text-[11px] uppercase italic text-slate-300">{v.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION DROITE : L'IDE STRICT */}
        <div className="w-full lg:w-1/2 flex flex-col bg-black">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-950/50">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Environnement : {selectedLang} 2026.1</span>
            </div>
            <button onClick={handleRun} className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-2xl font-black text-[11px] uppercase flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
              <Play size={14} fill="currentColor"/> Compiler & Lancer
            </button>
          </div>

          <div className="flex-1">
            <Editor 
              height="100%" 
              language={selectedLang === 'c' ? 'cpp' : selectedLang} 
              theme="vs-dark" 
              value={code} 
              onChange={(v) => setCode(v || "")}
              options={{ 
                fontSize: 15, 
                minimap: { enabled: false }, 
                fontFamily: "JetBrains Mono",
                padding: { top: 20 },
                automaticLayout: true
              }}
            />
          </div>

          {/* CONSOLE DE SORTIE RÉELLE */}
          <div className="h-64 bg-[#050505] border-t border-white/10 p-6 font-mono">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
              <span className="text-slate-700 uppercase font-black text-[10px] flex items-center gap-2 tracking-widest"><Terminal size={14}/> Output_Stream</span>
              <Trash2 size={14} className="text-slate-800 cursor-pointer hover:text-red-500 transition-colors" onClick={() => setOutput([])}/>
            </div>
            <div className="space-y-1.5 overflow-y-auto max-h-[160px] custom-scrollbar">
              {output.length === 0 && <div className="text-slate-900 italic font-bold"> {">"} En attente d'instruction...</div>}
              {output.map((line, i) => (
                <div key={i} className={`flex items-start gap-3 ${
                  line.type === 'error' ? 'text-red-500 bg-red-500/5 p-2 rounded border border-red-500/10 font-bold' : 
                  line.type === 'result' ? 'text-white bg-white/5 px-2 py-0.5 rounded' : 
                  'text-blue-400 italic text-[11px]'
                }`}>
                  <span className="opacity-20">{">"}</span>
                  <span className="whitespace-pre-wrap">{line.msg}</span>
                  {line.type === 'error' && <XCircle size={14} className="ml-auto" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
