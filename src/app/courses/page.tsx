"use client";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Play, Code2, Terminal, Search, Youtube, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

// Chargement dynamique de l'éditeur pour éviter les erreurs de rendu (SSR)
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const ELITE_LIBRARY = {
  "javascript": {
    name: "JavaScript",
    videoId: "Ssh71heLhXY", // Lien fonctionnel
    language: "javascript",
    defaultCode: "console.log('Elite JS Ready');"
  },
  "python": {
    name: "Python",
    videoId: "oUJolR5bX6g",
    language: "python",
    defaultCode: "print('Elite Python Ready')"
  },
  "c": {
    name: "Langage C",
    videoId: "q6FcVUFM42o",
    language: "c",
    defaultCode: "#include <stdio.h>\n\nint main() {\n    printf(\"Elite C Lab\\n\");\n    return 0;\n}"
  }
};

export default function UniversalLab() {
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [currentCourse, setCurrentCourse] = useState(ELITE_LIBRARY["javascript"]);
  const [code, setCode] = useState(currentCourse.defaultCode);
  const [output, setOutput] = useState("");

  // Empêche l'affichage avant que le client ne soit prêt
  useEffect(() => { setIsMounted(true); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.toLowerCase().trim();
    if (ELITE_LIBRARY[query as keyof typeof ELITE_LIBRARY]) {
      const course = ELITE_LIBRARY[query as keyof typeof ELITE_LIBRARY];
      setCurrentCourse(course);
      setCode(course.defaultCode);
      setOutput("");
      setSearch("");
    } else {
      alert("Disponibles : c, python, javascript");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col overflow-hidden">
      <nav className="p-4 border-b border-white/5 flex flex-col md:flex-row items-center gap-4 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link href="/dashboard"><ArrowLeft size={20} className="text-slate-500" /></Link>
          <h1 className="font-black italic text-xl uppercase tracking-tighter">Elite<span className="text-blue-500">Labs</span></h1>
        </div>
        <form onSubmit={handleSearch} className="flex-1 w-full max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher (c, python, javascript)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-2 pl-12 pr-4 outline-none focus:border-blue-500 text-sm"
          />
        </form>
        <button onClick={() => setOutput("> Compilation réussie...")} className="bg-blue-600 px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
          <Play size={14} fill="currentColor"/> Lancer
        </button>
      </nav>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="w-full lg:w-1/2 p-4 md:p-8 overflow-y-auto max-h-[40vh] lg:max-h-none">
          <div className="aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/5 mb-6 shadow-2xl">
             <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${currentCourse.videoId}`} allowFullScreen></iframe>
          </div>
          <div className="flex items-center gap-2 text-blue-500 mb-2"><Sparkles size={16} /> <span className="text-[10px] font-black uppercase">{currentCourse.language}</span></div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">{currentCourse.name}</h2>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col bg-[#050505] border-l border-white/5">
          <div className="flex-1 min-h-[300px]">
            <Editor 
              height="100%" 
              language={currentCourse.language} 
              theme="vs-dark" 
              value={code} 
              onChange={(v) => setCode(v || "")}
              options={{ fontSize: 14, minimap: { enabled: false }, fontFamily: "JetBrains Mono" }}
            />
          </div>
          <div className="h-40 bg-black border-t border-white/10 p-6 font-mono text-sm overflow-y-auto">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-700 mb-2"><Terminal size={14}/> Sortie</div>
             <pre className="text-blue-400">{output || "> En attente..."}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
