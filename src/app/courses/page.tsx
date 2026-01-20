"use client";
import { useState, useRef } from "react";
import dynamic from 'next/dynamic';
import { Search, Code2, Layers, Youtube, X, Terminal, Play, ChevronRight } from "lucide-react";

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// Définition du type pour les vidéos
interface Video {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
}

const VIDEO_DATABASE = [
  { id: "q6FcVUFM42o", title: "LANGAGE C : COURS COMPLET DÉBUTANT (2026)", category: "c", thumbnail: "https://img.youtube.com/vi/q6FcVUFM42o/maxresdefault.jpg" },
  { id: "oUJolR5bX6g", title: "APPRENDRE PYTHON (TUTO COMPLET 2H) - JONATHAN", category: "python", thumbnail: "https://img.youtube.com/vi/oUJolR5bX6g/maxresdefault.jpg" },
  { id: "LamjAFnybo0", title: "APPRENDRE PYTHON DE A À Z (MASTERCLASS)", category: "python", thumbnail: "https://img.youtube.com/vi/LamjAFnybo0/maxresdefault.jpg" },
  { id: "Ew7KG2j8eII", title: "JAVASCRIPT DE A À Z : LES BASES", category: "javascript", thumbnail: "https://img.youtube.com/vi/Ew7KG2j8eII/maxresdefault.jpg" },
  { id: "it86lQ1mOgw", title: "JAVASCRIPT : L'ESSENTIEL EN 1 HEURE", category: "javascript", thumbnail: "https://img.youtube.com/vi/it86lQ1mOgw/maxresdefault.jpg" }
];


const CODE_TEMPLATES = {
  c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int age;\n    printf("Entrez votre age: ");\n    scanf("%d", &age);\n    printf("Vous avez %d ans", age);\n    return 0;\n}`,
  python: 'print("Hello Python")',
  javascript: 'console.log("Hello JS")'
};

type OutputLine = {
    msg: string, 
    type: 'error' | 'success' | 'system' | 'result' | 'input'
};

export default function SmartWorkspace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Video[]>([]); 
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [showIDE, setShowIDE] = useState(false);
  const [selectedLang, setSelectedLang] = useState<keyof typeof CODE_TEMPLATES>("c");
  const [code, setCode] = useState(CODE_TEMPLATES.c);
  
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  
  const cpu = useRef({
    lineIndex: 0,
    memory: {} as Record<string, { value: any, address: string }>,
    didExecuteIf: false
  });

  const addToConsole = (msg: string, type: OutputLine['type']) => {
    setOutput(prev => [...prev, { msg, type }]);
  };

  // --- LOGIQUE DU MOTEUR DE COMPILATION ---
  const validateSyntax = (lines: string[]) => {
    const declaredVars = new Set<string>();
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line || line.startsWith("#") || line === "{" || line === "}" || line.startsWith("int main") || line.startsWith("return")) {
         const decl = line.match(/(?:int|float|char)\s+(\w+)/);
         if(decl) declaredVars.add(decl[1]);
         continue;
      }
      const isControl = line.startsWith("if") || line.startsWith("else") || line.endsWith("{");
      if (!isControl && !line.endsWith(";")) throw new Error(`Syntax Error: ';' manquant à la ligne ${i + 1}`);
      const cleanLine = line.replace(/"[^"]*"/g, "");
      const varDecl = cleanLine.match(/(?:int|float|char)\s+(\w+)/);
      if (varDecl) declaredVars.add(varDecl[1]);
    }
  };

  const executeEngine = (startIndex = 0) => {
    const lines = code.split('\n');
    if (startIndex === 0) {
      setOutput([]);
      try { validateSyntax(lines); } catch (err: any) { addToConsole(err.message, 'error'); return; }
      addToConsole("> Initialisation de l'environnement C...", 'system');
      cpu.current = { lineIndex: 0, memory: {}, didExecuteIf: false };
    }

    try {
      for (let i = startIndex; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line || line.startsWith("#") || line === "{" || line === "}" || line.startsWith("return")) continue;

        if (line.match(/(?:int|float|char)\s+(\w+)/)) {
          const match = line.match(/(?:int|float|char)\s+(\w+)/);
          if (match) {
            const name = match[1];
            cpu.current.memory[name] = { value: 0, address: "0x" + Math.random().toString(16).slice(2,6).toUpperCase() };
          }
          continue;
        }

        if (line.startsWith("scanf")) {
          if (!line.includes("&")) throw new Error(`Segmentation Fault: '&' manquant (Ligne ${i+1})`);
          setIsWaitingForInput(true);
          cpu.current.lineIndex = i + 1;
          return;
        }

        if (line.startsWith("printf")) {
          const contentMatch = line.match(/\((.*)\)/);
          const content = contentMatch ? contentMatch[1] : "";
          const parts = content.split(/,(.+)/);
          let txt = parts[0].replace(/"/g, '').replace(/\\n/g, '');
          if (parts[1]) {
            const vName = parts[1].trim().replace('&', '');
            txt = txt.replace(/%d|%s/g, cpu.current.memory[vName]?.value ?? "NULL");
          }
          addToConsole(txt, 'result');
        }
      }
      if (!isWaitingForInput) addToConsole("Process finished with exit code 0", 'success');
    } catch (err: any) { addToConsole(err.message, 'error'); }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    const currentVal = inputValue;
    setInputValue("");
    setIsWaitingForInput(false);
    addToConsole(currentVal, 'input');
    
    const varMatch = code.split('\n')[cpu.current.lineIndex - 1].match(/&(\w+)/);
    if (varMatch) {
        cpu.current.memory[varMatch[1]].value = currentVal;
    }
    
    // On relance l'exécution après le scanf
    setTimeout(() => executeEngine(cpu.current.lineIndex), 100);
  };

  // --- RECHERCHE ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) { setSearchResults([]); return; }
    const filtered = VIDEO_DATABASE.filter(v => v.category.includes(query) || v.title.toLowerCase().includes(query));
    setSearchResults(filtered);
    if (filtered.length > 0) setActiveVideoId(filtered[0].id);
  };

  return (
    <div className="h-screen bg-[#05070a] text-white flex flex-col font-sans overflow-hidden">
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0a0f1a]">
        <div className="w-1/4 flex items-center gap-2">
            <h1 className="font-black italic text-xl tracking-tighter">ELITE<span className="text-cyan-400">.</span>LABS</h1>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Rechercher (c, python, javascript...)"
            className="w-full bg-black/40 border border-white/10 rounded-full py-3 pl-14 pr-6 text-sm focus:border-cyan-400/50 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="w-1/4 flex justify-end">
          <button onClick={() => setShowIDE(true)} className="w-12 h-12 bg-cyan-400 text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-transform hover:scale-110">
              <Code2 size={22} />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-black p-6 flex items-center justify-center">
          <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0a0f1a]/50 shadow-2xl">
            {activeVideoId ? (
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`} allowFullScreen />
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <Youtube size={80} className="mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Faites une recherche pour charger les cours</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-80 border-l border-white/5 bg-[#0a0f1a]/30 p-6 flex flex-col gap-6 overflow-y-auto">
          <div className="flex items-center gap-3 mb-2 opacity-50 font-black uppercase text-[9px] tracking-widest">
            <Layers size={14} /> Playlist
          </div>
          {searchResults.length > 0 ? (
            <div className="space-y-6 w-full">
              {searchResults.map((video) => (
                <button key={video.id} onClick={() => setActiveVideoId(video.id)} className={`w-full group text-left transition-all ${activeVideoId === video.id ? 'opacity-100 scale-105' : 'opacity-30 hover:opacity-100'}`}>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-2 border border-white/10 shadow-lg">
                    <img src={video.thumbnail} className="object-cover w-full h-full" alt={video.title} />
                  </div>
                  <p className="text-[9px] font-black text-slate-200 uppercase leading-tight line-clamp-2">{video.title}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[9px] text-slate-600 italic uppercase text-center">
              Rien à afficher.<br/>Veuillez lancer une recherche.
            </div>
          )}
        </div>
      </div>

      {showIDE && (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl p-4 flex items-center justify-center">
          <div className="w-full max-w-5xl h-[90vh] bg-[#0d1117] rounded-[2.5rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
            
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowIDE(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
                <select 
                  value={selectedLang} 
                  onChange={(e) => { 
                    const lang = e.target.value as keyof typeof CODE_TEMPLATES;
                    setSelectedLang(lang); 
                    setCode(CODE_TEMPLATES[lang]); 
                    setOutput([]); 
                  }}
                  className="bg-zinc-900 text-[10px] font-black uppercase px-4 py-2 rounded-xl border border-white/10 text-cyan-400 outline-none cursor-pointer"
                >
                  <option value="c">Langage C (GCC)</option>
                  <option value="python">Python 3</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>
              <button 
                onClick={() => executeEngine(0)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95"
              >
                <Play size={14} fill="black" /> Run Code
              </button>
            </div>

            <div className="flex-1 min-h-0">
              <Editor 
                height="100%" 
                language={selectedLang === "c" ? "cpp" : selectedLang} 
                theme="vs-dark" 
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{ fontSize: 16, minimap: { enabled: false }, padding: { top: 20 }, scrollBeyondLastLine: false }}
              />
            </div>

            <div className="h-48 bg-black border-t border-white/10 p-5 font-mono text-xs overflow-y-auto">
              <div className="flex items-center gap-2 text-slate-500 font-black uppercase text-[9px] mb-3 tracking-[0.2em]"><Terminal size={12}/> Console Output</div>
              <div className="space-y-2">
                {output.length === 0 && <div className="text-slate-700 italic">Prêt pour l'exécution...</div>}
                {output.map((line, i) => (
                  <div key={i} className={`flex items-start gap-2 ${line.type === 'error' ? 'text-red-500 font-bold' : line.type === 'result' ? 'text-emerald-400' : line.type === 'input' ? 'text-cyan-400' : 'text-slate-500 italic'}`}>
                    <span className="whitespace-pre-wrap">{line.msg}</span>
                  </div>
                ))}
                {isWaitingForInput && (
                  <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-emerald-500 animate-pulse" />
                    <input 
                        autoFocus 
                        className="bg-transparent border-b border-emerald-900 outline-none flex-1 text-white" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                    />
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
