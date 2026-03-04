"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { Play, Terminal, ChevronRight } from "lucide-react";

// Import dynamique de Monaco pour éviter les erreurs SSR
const Editor = dynamic(() => import('@monaco-editor/react'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#0a0f1a] animate-pulse" />
});

type Language = 'python' | 'javascript';

export default function EliteLabsIDE() {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Language>('python');
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<{msg: string, type: string}[]>([]);
  const [isReady, setIsReady] = useState(false);
  const pyodide = useRef<any>(null);

  // 1. Fix pour l'hydratation (évite les erreurs Next.js au montage)
  useEffect(() => {
    setMounted(true);
    
    async function initPy() {
      if (typeof window !== "undefined" && (window as any).loadPyodide) {
        try {
          pyodide.current = await (window as any).loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
          });
          setIsReady(true);
          addToConsole("Moteur Python prêt (Client-Side).", "system");
        } catch (e) {
          addToConsole("Erreur de chargement du moteur.", "error");
        }
      }
    }
    initPy();
  }, []);

  const addToConsole = (msg: string, type: string) => {
    setOutput(prev => [...prev, { msg: String(msg), type }]);
  };

  const runCode = async () => {
    setOutput([]);
    if (lang === 'python') {
      if (!isReady) return addToConsole("Python est encore en chargement...", "system");
      try {
        pyodide.current.setStdout({
          batched: (text: string) => addToConsole(text, 'result')
        });
        await pyodide.current.runPythonAsync(code);
      } catch (err: any) {
        addToConsole(err.message, 'error');
      }
    } else {
      try {
        // Exécution JS sécurisée
        const logs: string[] = [];
        const customLog = (m: any) => addToConsole(m, 'result');
        const originalLog = console.log;
        console.log = customLog;
        eval(code);
        console.log = originalLog;
      } catch (err: any) {
        addToConsole(err.message, 'error');
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen bg-[#0a0f1a] text-white flex flex-col font-sans overflow-hidden">
      <nav className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0b1221]">
        <div className="flex items-center gap-4">
          <h1 className="font-black italic text-xl tracking-tighter"><span className="text-cyan-400"></span></h1>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as Language)}
            className="bg-zinc-900 border border-white/10 rounded px-2 py-1 text-[10px] font-bold outline-none"
          >
            <option value="python">PYTHON 3.11</option>
            <option value="javascript">JAVASCRIPT</option>
          </select>
        </div>

        <button onClick={runCode} className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-lg font-black text-[11px] uppercase flex items-center gap-2 transition-all active:scale-95">
          <Play size={14} fill="currentColor"/> {isReady || lang === 'javascript' ? "Run" : "Loading..."}
        </button>
      </nav>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0">
          <Editor 
            height="100%" 
            language={lang} 
            theme="vs-dark" 
            value={code}
            onChange={(v) => setCode(v || "")}
            options={{ 
              fontSize: 16, 
              fontFamily: "JetBrains Mono",
              minimap: { enabled: false },
              automaticLayout: true,
            }} 
          />
        </div>

        <div className="h-1/3 bg-black flex flex-col border-t border-white/10">
          <div className="p-2 px-4 bg-zinc-950 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Terminal size={12}/> Console
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto bg-[#050505]">
            {output.map((line, i) => (
              <div key={i} className={line.type === 'error' ? 'text-red-400' : line.type === 'result' ? 'text-emerald-400' : 'text-slate-500'}>
                {line.type === 'result' && ">> "}{line.msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
