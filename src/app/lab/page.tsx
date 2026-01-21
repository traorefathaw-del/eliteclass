"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { Play, Terminal, Code2, Trash2, Cpu, AlertCircle, ChevronRight } from "lucide-react";

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const INITIAL_CODE = `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n \n    return 0;\n}`;

export default function EliteLabsUniversalIDE() {
  const [isMounted, setIsMounted] = useState(false);
  const [code, setCode] = useState(INITIAL_CODE);
  const [output, setOutput] = useState<{msg: string, type: 'error' | 'success' | 'system' | 'result' | 'input'}[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  
  const cpu = useRef({
    lineIndex: 0,
    memory: {} as Record<string, { value: any, address: string }>,
    didExecuteIf: false
  });

  useEffect(() => { setIsMounted(true); }, []);

  const addToConsole = (msg: string, type: any) => {
    setOutput(prev => [...prev, { msg, type }]);
  };

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
      if (!isControl && !line.endsWith(";")) {
        throw new Error(`Syntax Error: ';' manquant à la ligne ${i + 1}`);
      }

      const cleanLine = line.replace(/"[^"]*"/g, "");
      const varDecl = cleanLine.match(/(?:int|float|char)\s+(\w+)/);
      if (varDecl) declaredVars.add(varDecl[1]);

      const words = cleanLine.match(/\b([a-zA-Z_]\w*)\b/g) || [];
      const keywords = ["int", "char", "float", "if", "else", "printf", "scanf", "return", "main"];
      
      for (const word of words) {
        if (keywords.includes(word) || !isNaN(Number(word))) continue;
        if (varDecl && word === varDecl[1]) continue;
        if (!declaredVars.has(word)) {
          throw new Error(`Error: Variable '${word}' non définie (Ligne ${i + 1})`);
        }
      }
    }
  };

  const executeEngine = (startIndex = 0) => {
    const lines = code.split('\n');

    if (startIndex === 0) {
      setOutput([]);
      try {
        validateSyntax(lines);
      } catch (err: any) {
        addToConsole(err.message, 'error');
        return;
      }
      addToConsole("> Initialisation de l'environnement C...", 'system');
      cpu.current = { lineIndex: 0, memory: {}, didExecuteIf: false };
    }

    try {
      for (let i = startIndex; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line || line.startsWith("#") || line === "{" || line === "}" || line.startsWith("return")) continue;

        // Déclaration et Assignation directe (ex: int a = 5;)
        if (line.match(/(?:int|float|char)\s+(\w+)\s*=?\s*(.*);/)) {
          const match = line.match(/(?:int|float|char)\s+(\w+)\s*=?\s*(.*);/);
          const name = match![1];
          let val = match![2] ? eval(match![2].replace(/;/g, '')) : 0;
          cpu.current.memory[name] = { value: val, address: "0x" + Math.random().toString(16).slice(2,6).toUpperCase() };
          continue;
        }

        // Assignation simple (ex: a = 10;)
        if (line.match(/^(\w+)\s*=\s*(.*);/)) {
            const match = line.match(/^(\w+)\s*=\s*(.*);/);
            const name = match![1];
            let expr = match![2];
            Object.keys(cpu.current.memory).forEach(v => {
                expr = expr.replace(new RegExp(`\\b${v}\\b`, 'g'), cpu.current.memory[v].value);
            });
            cpu.current.memory[name].value = eval(expr);
            continue;
        }

        if (line.startsWith("if")) {
          let cond = line.match(/\((.*)\)/)?.[1] || "";
          Object.keys(cpu.current.memory).forEach(v => {
            cond = cond.replace(new RegExp(`\\b${v}\\b`, 'g'), cpu.current.memory[v].value);
          });
          cpu.current.didExecuteIf = eval(cond);
          if (!cpu.current.didExecuteIf) i++; 
          continue;
        }

        if (line.startsWith("else")) {
          if (cpu.current.didExecuteIf) i++;
          continue;
        }

        if (line.startsWith("scanf")) {
          if (!line.includes("&")) throw new Error(`Segmentation Fault: '&' manquant (Ligne ${i+1})`);
          setIsWaitingForInput(true);
          cpu.current.lineIndex = i + 1;
          return;
        }

        // --- BLOC PRINTF AMÉLIORÉ ---
        if (line.startsWith("printf")) {
          const content = line.match(/\((.*)\)/)?.[1] || "";
          
          // On cherche la séparation entre la chaîne de format et les arguments
          const firstCommaIndex = content.indexOf('",');
          
          if (firstCommaIndex !== -1) {
            let formatStr = content.substring(0, firstCommaIndex + 1).trim().replace(/"/g, '');
            const argsPart = content.substring(firstCommaIndex + 2).trim();
            const argNames = argsPart.split(',').map(v => v.trim());
            
            let finalTxt = formatStr;
            argNames.forEach(name => {
              const cleanName = name.replace('&', '');
              const val = cpu.current.memory[cleanName]?.value ?? "NULL";
              // Remplace le prochain spécificateur trouvé (%d, %f, %s ou %c)
              finalTxt = finalTxt.replace(/%d|%f|%s|%c/, val);
            });

            addToConsole(finalTxt.replace(/\\n/g, ''), 'result');
          } else {
            // Texte simple sans variables
            let txt = content.replace(/"/g, '').replace(/\\n/g, '');
            addToConsole(txt, 'result');
          }
        }
      }
      addToConsole("Process finished with exit code 0", 'success');
    } catch (err: any) {
      addToConsole(err.message, 'error');
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    addToConsole(inputValue, 'input');
    
    const varMatch = code.split('\n')[cpu.current.lineIndex - 1].match(/&(\w+)/);
    if (varMatch) {
        // Utilisation de Number() pour supporter int et float
        cpu.current.memory[varMatch[1]].value = Number(inputValue);
    }

    setIsWaitingForInput(false);
    setInputValue("");
    executeEngine(cpu.current.lineIndex);
  };

  if (!isMounted) return null;

  return (
    <div className="h-screen bg-[#0a0f1a] text-white flex flex-col font-sans overflow-hidden">
      <nav className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0a0f1a]">
        <div className="w-[150px]" />
        <h1 className="font-black italic text-xl uppercase tracking-tighter tracking-[0.1em]">ELITE<span className="text-[#22d3ee]">.</span>LABS</h1>
        <button onClick={() => executeEngine(0)} className="bg-emerald-600 hover:bg-emerald-500 px-8 py-2.5 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 shadow-lg active:scale-95 transition-all">
          <Play size={14} fill="currentColor"/> Run Code
        </button>
      </nav>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 border-b border-white/5">
          <Editor 
            height="100%" 
            language="cpp" 
            theme="vs-dark" 
            value={code} 
            onChange={(v) => setCode(v || "")} 
            options={{ 
              fontSize: 16, 
              minimap: { enabled: false }, 
              fontFamily: "JetBrains Mono",
              contextmenu: false,
              lineNumbers: "on",
              scrollBeyondLastLine: false
            }} 
          />
        </div>

        <div className="h-1/3 bg-black flex flex-col">
          <div className="p-3 border-b border-white/5 flex items-center justify-between bg-zinc-950">
            <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2 tracking-[0.2em] shadow-sm">
                <Terminal size={14}/> Console Output
            </span>
            {isWaitingForInput && <span className="text-[9px] font-bold text-emerald-500 animate-pulse uppercase tracking-widest">Waiting for input...</span>}
          </div>
          <div className="flex-1 p-5 font-mono text-[13px] overflow-y-auto space-y-2 bg-[#010101] custom-scrollbar">
            {output.map((line, i) => (
              <div key={i} className={`
                ${line.type === 'error' ? 'text-red-500 font-bold bg-red-500/5 p-1 rounded' : 
                  line.type === 'result' ? 'text-emerald-400' : 
                  line.type === 'system' ? 'text-cyan-600 italic' :
                  line.type === 'input' ? 'text-blue-400' :
                  'text-slate-500'}
              `}>
                {line.type === 'result' ? `> ${line.msg}` : line.msg}
              </div>
            ))}
            {isWaitingForInput && (
              <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
                <ChevronRight size={14} className="text-emerald-500" />
                <input 
                  autoFocus 
                  className="bg-transparent border-b border-emerald-900/50 outline-none flex-1 text-white py-1" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
