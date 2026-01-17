"use client";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Play, Terminal, ArrowLeft, Code2, Trash2, Cpu, AlertCircle } from "lucide-react";
import Link from "next/link";

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// STARTERS VIDES (Règles de l'art : l'utilisateur commence de zéro)
const STARTER_CODE = {
  c: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    \n    return 0;\n}`,
  python: `# Saisissez votre programme Python\n`,
  javascript: `// Saisissez votre programme JavaScript\n`
};

export default function EliteLabsUniversalIDE() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"c" | "python" | "javascript">("c");
  const [code, setCode] = useState(STARTER_CODE.c);
  const [output, setOutput] = useState<{msg: string, type: 'error' | 'success' | 'system' | 'result'}[]>([]);
  
  useEffect(() => { setIsMounted(true); }, []);

  const executeEngine = () => {
    setOutput([{ msg: `> Initialisation de l'environnement ${selectedLang.toUpperCase()}...`, type: 'system' }]);
    
    const lines = code.split('\n');
    const logs: string[] = [];
    const memory: Record<string, any> = {};

    setTimeout(() => {
      try {
        // --- 1. ANALYSE SYNTAXIQUE GLOBALE ---
        lines.forEach((line, index) => {
          const l = line.trim();
          if (!l || l.startsWith("#") || l.startsWith("//") || l === "{" || l === "}") return;

          // Règle stricte pour le C
          if (selectedLang === "c" && !l.endsWith(";") && !l.startsWith("int main") && !l.startsWith("return")) {
            throw new Error(`Syntax Error: ';' manquant à la ligne ${index + 1}`);
          }

          // Gestion universelle des variables (a = 10; let a = 10; a = b + 1;)
          const assignMatch = l.match(/(?:int|let|const|var\s+)?(\w+)\s*[:=]\s*([^;]+)/);
          if (assignMatch) {
            const varName = assignMatch[1].trim();
            let expression = assignMatch[2].trim();

            Object.keys(memory).forEach(v => {
              const regex = new RegExp(`\\b${v}\\b`, 'g');
              expression = expression.replace(regex, memory[v]);
            });

            try { memory[varName] = eval(expression); } catch (e) {}
          }
        });

        // --- 2. EXÉCUTION DES SORTIES ---
        if (selectedLang === "javascript") {
          // Pour JS, on utilise l'exécution réelle du navigateur
          const originalLog = console.log;
          console.log = (...args) => logs.push(args.join(' '));
          try {
            new Function(code)();
          } catch (e: any) {
            throw new Error(`JS Runtime Error: ${e.message}`);
          }
          console.log = originalLog;
        } else {
          // Pour C et Python (Simulation de sortie propre)
          lines.forEach((line, index) => {
            const l = line.trim();
            if (l.includes("printf") || l.includes("print")) {
              const contentMatch = l.match(/\((.*)\)/);
              if (!contentMatch) return;

              const content = contentMatch[1];
              const parts = content.split(/,(.+)/); // Sépare le texte formaté de la variable
              
              // Nettoyage pour ne garder que le texte pur
              let label = parts[0].replace(/["']/g, '').replace(/%d|%s|%f|f|\\n/g, '').trim();
              let varExpr = parts[1] ? parts[1].replace(/;/g, '').trim() : "";

              // Pour Python f-strings : print(f"Valeur: {a}")
              if (selectedLang === "python" && content.includes("{") && content.includes("}")) {
                let interpolated = content.replace(/["']|f/g, '');
                Object.keys(memory).forEach(v => {
                  interpolated = interpolated.replace(new RegExp(`\\{${v}\\}`, 'g'), memory[v]);
                });
                logs.push(interpolated);
              } 
              // Pour C et Python standard : print("Valeur", a)
              else if (varExpr) {
                Object.keys(memory).forEach(v => {
                  varExpr = varExpr.replace(new RegExp(`\\b${v}\\b`, 'g'), memory[v]);
                });
                try {
                  logs.push(`${label} ${eval(varExpr)}`);
                } catch (e) {
                  throw new Error(`Variable Error: '${varExpr}' non défini (Ligne ${index + 1})`);
                }
              } else {
                logs.push(label);
              }
            }
          });
        }

        // --- 3. AFFICHAGE DES LOGS ---
        if (logs.length > 0) {
          setOutput(prev => [...prev, ...logs.map(l => ({ msg: l, type: 'result' as const }))]);
          setOutput(prev => [...prev, { msg: "Process finished with exit code 0", type: 'success' }]);
        } else {
          setOutput(prev => [...prev, { msg: "Build Success: Aucune sortie détectée.", type: 'system' }]);
        }

      } catch (err: any) {
        setOutput(prev => [...prev, { msg: err.message, type: 'error' }]);
      }
    }, 500);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans overflow-hidden">
      {/* HEADER PROFESSIONNEL */}
      <nav className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-4">
          <Link href="/"><ArrowLeft size={20} className="text-slate-400 hover:text-white"/></Link>
          <h1 className="font-black italic text-xl uppercase tracking-tighter">Elite<span className="text-blue-500">.</span>Labs</h1>
        </div>

        <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
            {["javascript", "python", "c"].map((l) => (
              <button 
                key={l} 
                onClick={() => { 
                  setSelectedLang(l as any); 
                  setCode(STARTER_CODE[l as keyof typeof STARTER_CODE]); 
                  setOutput([]); 
                }}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${selectedLang === l ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
              >
                {l}
              </button>
            ))}
        </div>

        <button onClick={executeEngine} className="bg-emerald-600 hover:bg-emerald-500 px-8 py-2.5 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 shadow-lg active:scale-95 transition-all">
          <Play size={14} fill="currentColor"/> Run Code
        </button>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* ÉDITEUR */}
        <div className="flex-1 flex flex-col border-r border-white/5">
          <div className="p-3 bg-slate-900/30 border-b border-white/5 flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
            <Code2 size={14} className="text-blue-500"/> workspace / main.{selectedLang === 'c' ? 'c' : selectedLang === 'python' ? 'py' : 'js'}
          </div>
          <Editor 
            height="100%" 
            language={selectedLang === 'c' ? 'cpp' : selectedLang} 
            theme="vs-dark" 
            value={code} 
            onChange={(v) => setCode(v || "")}
            options={{ fontSize: 16, minimap: { enabled: false }, fontFamily: "JetBrains Mono", padding: { top: 20 } }}
          />
        </div>

        {/* TERMINAL UNIVERSEL */}
        <div className="w-[450px] flex flex-col bg-black">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-950">
            <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2 tracking-[0.2em]"><Terminal size={14}/> Console</span>
            <Trash2 size={14} className="text-slate-800 cursor-pointer hover:text-red-500" onClick={() => setOutput([])}/>
          </div>
          
          <div className="flex-1 p-6 font-mono text-[13px] overflow-y-auto space-y-3 bg-[#010101]">
            {output.length === 0 && (
                <div className="h-full flex items-center justify-center opacity-10">
                    <Cpu size={40} />
                </div>
            )}
            {output.map((line, i) => (
              <div key={i} className={`flex items-start gap-3 p-2 rounded ${
                line.type === 'error' ? 'text-red-500 font-bold bg-red-500/5 border border-red-500/10' : 
                line.type === 'result' ? 'text-emerald-400 font-bold border-l-2 border-emerald-500 pl-4' : 
                'text-slate-400 italic text-[11px]'
              }`}>
                {line.type === 'error' && <AlertCircle size={14} className="mt-0.5 shrink-0"/>}
                <span className="whitespace-pre-wrap">{line.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
