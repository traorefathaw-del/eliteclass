"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { Play, Terminal } from "lucide-react";

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

  useEffect(() => {
    setMounted(true);
    
    async function initPy() {
      if (typeof window !== "undefined") {
        // Chargement du script Pyodide dynamiquement si pas présent
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        script.onload = async () => {
          try {
            pyodide.current = await (window as any).loadPyodide();
            setIsReady(true);
            addToConsole("Système prêt. Python 3.14 chargé.", "system");
          } catch (e) {
            addToConsole("Erreur d'initialisation moteur.", "error");
          }
        };
        document.head.appendChild(script);
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
        // 1. Configurer la sortie Standard (print)
        pyodide.current.setStdout({
          batched: (text: string) => addToConsole(text, 'result')
        });

        // 2. Injecter le support de input() via JavaScript prompt
        // On utilise l'API JS de Pyodide pour mapper l'input Python sur window.prompt
        const setupCode = `
import __main__
from pyodide.ffi import create_proxy
import js

def custom_input(prompt_text=""):
    return js.window.prompt(prompt_text)

__main__.input = custom_input
        `;
        pyodide.current.runPython(setupCode);

        // 3. Exécuter le code utilisateur de manière asynchrone
        await pyodide.current.runPythonAsync(code);

      } catch (err: any) {
        // Nettoyage du message d'erreur souvent très long en Python/Pyodide
        const errorMsg = err.message.split('PythonError:').pop();
        addToConsole(errorMsg || err.message, 'error');
      }
    } else {
      // Bloc JS standard
      try {
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
          <h1 className="font-black italic text-xl tracking-tighter text-cyan-400"><span className="text-white"></span></h1>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as Language)}
            className="bg-zinc-900 border border-white/10 rounded px-2 py-1 text-[10px] font-bold outline-none cursor-pointer"
          >
            <option value="python">PYTHON 3.14</option>
            <option value="javascript">JAVASCRIPT</option>
          </select>
        </div>

        <button 
          onClick={runCode} 
          disabled={lang === 'python' && !isReady}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 px-6 py-2 rounded-lg font-black text-[11px] uppercase flex items-center gap-2 transition-all active:scale-95"
        >
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
              fontSize: 15, 
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              automaticLayout: true,
              padding: { top: 20 }
            }} 
          />
        </div>

        <div className="h-1/3 bg-[#050505] flex flex-col border-t border-white/10">
          <div className="p-2 px-4 bg-zinc-950 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5">
            <Terminal size={12}/> Console
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
            {output.length === 0 && <span className="text-zinc-700 italic">Appuyez sur Run pour voir le résultat...</span>}
            {output.map((line, i) => (
              <div key={i} className={`mb-1 ${line.type === 'error' ? 'text-red-400 bg-red-400/10 p-1 rounded' : line.type === 'result' ? 'text-emerald-400' : 'text-slate-500'}`}>
                {line.type === 'result' && <span className="opacity-50 mr-2 font-bold">»</span>}{line.msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
