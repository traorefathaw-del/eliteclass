"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { createClient } from "@/utils/supabase"; 
import { 
  Star, CheckCircle2, X, 
  Trophy, Award, Zap, XCircle, Lock, Activity, Loader2
} from "lucide-react";

// Import dynamique de l'éditeur avec un fallback pour éviter les erreurs Turbopack
const Editor = dynamic(() => import('@monaco-editor/react'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-500">Chargement de l'interface de code...</div>
});

// --- STRUCTURE DES CHAPITRES (Ta structure originale) ---
const CHAPTERS = [
  {
    id: "ch1",
    title: "Chapitre 1 : Les Calculs",
    color: "bg-indigo-600",
    lessons: [
      { id: "l1_1", title: "La Soustraction", task: "cree 2 variables et soustrait les pour obtenir 10 ", expected: "10", },
      { id: "l1_2", title: "L'Addition ", task: "cree 2 variables et additionne les pour obtenir 80.", expected: "80", },
      { id: "l1_3", title: "La Division", task: "cree 2 variables et divise les pour obtenir 6.", expected: "6.0", },
      { id: "l1_4", title: "le Modulo", task: "trouve le module de 20 par 3", expected: "2", },
      { id: "l1_5", title: "🏆 Test Final 1", task: "Cree une variable de 50, soustrait 10, puis affiche le modulo de ce resultat par 3", expected: "1", },
    ]
  },
  
  
  {
  	id: "ch2",
    title: "Chapitre 2 : Les Variables & Types",
    color: "bg-emerald-600",
    lessons: [
      { id: "l2_1", title: "L'Assignation", task: "cree une varialble nommée score et donne lui une valeur de 100 ", expected: "100", },
      { id: "l2_2", title: "le type float", task: "cree  variable prix égale à 19.99 et affiche la", expected: "19.99", },
      { id: "l2_3", title: "Le Texte", task: "cree un speudo avec le texte 'ELITE123' et affiche la", expected: "ELITE123", },
      { id: "l2_4", title: "Concaténation", task: "Affiche le texte 'Bravo' collé à la variable speudo 'ELITE123' ", expected: "Bravo ELITE123", },
      { id: "l2_5", title: "🏆 Test Final 2", task: "cree une variable 'alex' et une variable nommé niveau et donne lui une valeur de 10 et affiche le tout", expected: "Alex est de niveau 10", },
    ]
  },
  
  
  {
    id: "ch3",
    title: "Chapitre 3 : Logique & Conditions",
    color: "bg-cyan-600",
    lessons: [
      { id: "l3_1", title: "Comparaison", task: "Affiche si 15 est plus grand que 10 (15 > 10)", expected: "True", },
      { id: "l3_2", title: "Le IF", task: "Si x=10 affiche 'OK'", expected: "OK", },
      { id: "l3_3", title: "Le ELSE", task: "Cree x = 5. Si x est egal a 10 affiche 'OUI', sinon affiche 'NON'", expected: "Non",},
      { id: "l3_4", title: "ELIF", task: "Affiche (5 > 2) and (10 < 20)", expected: "True",  },
      { id: "l3_5", title: "🏆 Test Final 3", task: "Cree pv = 0. Si pv <= 0 affiche 'Game Over', sinon affiche 'Vivant'", expected: "Game Over",  },
    ]
  },
    
  
  {
    id: "ch4",
    title: "Chapitre 4 : Listes & Boucles",
    color: "bg-indigo-600",
    lessons: [
      { id: "l4_1", title: "Création Liste", task: "Crée  une liste et affiche 1,2 dans cette liste ", expected: "[1, 2]",  },
      { id: "l4_2", title: "Accès Index", task: "Affiche le 1er element la liste [10, 20]", expected: "10",  },
      { id: "l4_3", title: "Boucle FOR", task: "à l'aide d'une boucle for affiche 0, 1, 2", expected: "0\n1\n2", },
      { id: "l4_4", title: "Parcourir Liste", task: "Affiche banane et pomme et parcours cette liste", expected: "pomme\nbanane",},
      { id: "l4_5", title: "🏆 Test Final 4", task: "Somme d'une liste  L=[1, 2, 3]", expected: "6", },
    ]
  },
  {
    id: "ch5",
    title: "Chapitre 5 : Fonctions & Maîtrise",
    color: "bg-purple-600",
    lessons: [
      { id: "l5_1", title: "Création de fonction", task: "Crée la fonction hello() et affiche 'Salut' dans cette fonction", expected: "Salut", },
      { id: "l5_2", title: "Arguments", task: "cree une fonction double(n) qui calcul le double de 10", expected: "20",},
      { id: "l5_3", title: "Return", task: "cree une fonction qui renvoie unea somme de 25", expected: "25",},
      { id: "l5_4", title: "Modules", task: "Importe math et affiche la racine carré de 16", expected: "4", },
      { id: "l5_5", title: "🚀 PROJET FINAL", task: "Crée une fonction nommée prix_final qui prend un prix de 120 en paramètre. Si le prix est supérieur à 100, la fonction doit retourner le prix avec une réduction de 20. Sinon, elle retourne le prix normal", expected: "Moyenne: 100", },
    ]
  }
];

export default function EliteLingoApp() {
  const supabase = createClient();
  const [view, setView] = useState<'map' | 'exercise'>('map');
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'running'>('idle');
  const [errorDetails, setErrorDetails] = useState({ expected: "", received: "", technical: "" });
  const [mounted, setMounted] = useState(false);
  const [isPyReady, setIsPyReady] = useState(false);
  const pyodide = useRef<any>(null);

  // --- INITIALISATION ---
  useEffect(() => {
    setMounted(true);
    
    async function initApp() {
      // 1. Session User
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase.from('profile').select('xp, completed_lessons').eq('id', user.id).maybeSingle();
        if (data) {
          setXp(data.xp || 0);
          setCompletedLessons(data.completed_lessons || []);
        }
      }

      // 2. Pyodide (Python in Browser)
      if (typeof window !== "undefined") {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        script.onload = async () => {
          pyodide.current = await (window as any).loadPyodide();
          setIsPyReady(true);
        };
        document.head.appendChild(script);
      }
    }

    initApp();
  }, []);

  const saveProgress = async (newXp: number, newLessons: string[]) => {
    if (user) {
      await supabase.from('profile').upsert({ 
        id: user.id, 
        xp: newXp, 
        completed_lessons: newLessons 
      });
    }
  };

  const startLesson = (lesson: any, lIdx: number, cIdx: number) => {
    setCurrentLesson(lesson);
    setCurrentLessonIdx(lIdx);
    setCurrentChapterIdx(cIdx);
    setCode(lesson.code || "");
    setStatus('idle');
    setView('exercise');
  };

  const checkCode = async () => {
    if (!isPyReady) return;
    setStatus('running');
    let output: string[] = [];
    
    try {
      pyodide.current.setStdout({ batched: (text: string) => { output.push(text.trim()); } });
      await pyodide.current.runPythonAsync(code);
      const res = output.join("\n");
      
      if (res === currentLesson.expected) {
        setStatus('success');
        if (!completedLessons.includes(currentLesson.id)) {
          const nextXp = xp + 25;
          const nextLessons = [...completedLessons, currentLesson.id];
          setXp(nextXp);
          setCompletedLessons(nextLessons);
          saveProgress(nextXp, nextLessons);
        }
      } else {
        setStatus('error');
        setErrorDetails({ expected: currentLesson.expected, received: res, technical: "" });
      }
    } catch (e: any) { 
      setStatus('error');
      setErrorDetails({ expected: currentLesson.expected, received: "Erreur de syntaxe", technical: e.message });
    }
  };

  if (!mounted) return null;

  if (view === 'map') {
    return (
      <div className="min-h-screen bg-[#020617] text-white pb-20 font-sans">
        <nav className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/5 p-4 flex justify-between px-6 items-center">
            <div className="font-black italic text-xl tracking-tighter uppercase">
              <span className="text-cyan-500"></span>
            </div>
            <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-2xl border border-yellow-500/30">
                <Zap size={18} className="text-yellow-400 fill-yellow-400" />
                <span className="font-black text-yellow-500 tracking-tighter">{xp} XP</span>
            </div>
        </nav>

        <main className="max-w-md mx-auto py-10 px-6">
          {!isPyReady && (
            <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3">
              <Loader2 className="animate-spin text-blue-400" size={18} />
              <p className="text-[10px] font-bold uppercase text-blue-400">Initialisation du noyau Python...</p>
            </div>
          )}

          {CHAPTERS.map((chapter, cIdx) => (
            <div key={chapter.id} className="mb-20">
              <div className={`${chapter.color} p-8 rounded-[32px] mb-12 shadow-2xl relative overflow-hidden border-b-8 border-black/20`}>
                <h2 className="text-white font-black text-xl uppercase tracking-tighter italic">{chapter.title}</h2>
                <Award className="absolute -right-6 -bottom-6 text-white/10 rotate-12 w-32 h-32" />
              </div>

              <div className="flex flex-col items-center gap-10">
                {chapter.lessons.map((lesson, lIdx) => {
                  const isDone = completedLessons.includes(lesson.id);
                  const prevLessonId = lIdx > 0 ? chapter.lessons[lIdx-1].id : (cIdx > 0 ? CHAPTERS[cIdx-1].lessons[4].id : null);
                  const isLocked = prevLessonId ? !completedLessons.includes(prevLessonId) : false;
                  const offsets = ["ml-0", "ml-24", "ml-0", "-ml-24", "ml-0"];

                  return (
                    <div key={lesson.id} className={`flex flex-col items-center ${offsets[lIdx]}`}>
                      <button
                        disabled={isLocked || !isPyReady}
                        onClick={() => startLesson(lesson, lIdx, cIdx)}
                        className={`w-20 h-20 rounded-full border-b-[8px] transition-all flex items-center justify-center relative active:translate-y-1 active:border-b-0
                          ${isDone ? 'bg-emerald-500 border-emerald-700 shadow-lg' : 
                            isLocked ? 'bg-zinc-800 border-zinc-950 opacity-40' : 
                            'bg-cyan-500 border-cyan-700 shadow-xl animate-pulse'}
                        `}
                      >
                        {isLocked ? <Lock size={24} className="text-zinc-500" /> : 
                         lIdx === 4 ? <Trophy className="text-white w-8 h-8" /> : 
                         isDone ? <CheckCircle2 className="w-8 h-8 text-white" /> : <Star className="w-8 h-8 text-white" fill="white" />}
                      </button>
                      <span className="mt-4 font-black text-[10px] uppercase tracking-widest text-zinc-500 italic text-center max-w-[100px]">
                        {lesson.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0f1a] flex flex-col overflow-hidden">
      <header className="p-4 flex items-center gap-6 border-b border-white/5">
        <button onClick={() => setView('map')} className="text-zinc-500 hover:text-white p-2 bg-white/5 rounded-xl">
          <X className="w-8 h-8"/>
        </button>
        <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${((currentLessonIdx + 1) / 5) * 100}%` }} />
        </div>
        <div className="px-4 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full font-black text-yellow-500 text-sm italic">
            {xp} XP
        </div>
      </header>

      <main className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full overflow-hidden">
        <h2 className="text-2xl md:text-4xl font-black mb-6 text-white italic uppercase tracking-tighter leading-tight">
          {currentLesson.task}
        </h2>
        
        <div className="flex-1 bg-black rounded-[40px] border border-white/10 overflow-hidden flex flex-col relative shadow-2xl">
          <div className="flex-1 pt-4">
            <Editor 
              height="100%" 
              language="python" 
              theme="vs-dark" 
              value={code} 
              onChange={(v) => setCode(v || "")}
              options={{ 
                fontSize: 18, 
                fontFamily: "JetBrains Mono", 
                minimap: { enabled: false },
                lineNumbers: "on",
                padding: { top: 20 },
                scrollBeyondLastLine: false,
              }} 
            />
          </div>

          <div className={`p-8 border-t border-white/5 transition-all duration-300 ${
            status === 'success' ? 'bg-emerald-900/40' : 
            status === 'error' ? 'bg-red-900/40' : 'bg-[#111827]/80'
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                {status === 'success' ? (
                  <CheckCircle2 className="text-emerald-400 w-10 h-10" />
                ) : status === 'error' ? (
                  <XCircle className="text-red-400 w-10 h-10" />
                ) : (
                  <Activity className="text-zinc-600 w-10 h-10" />
                )}
                <div>
                  <h3 className={`font-black uppercase text-sm tracking-widest italic ${status === 'success' ? 'text-emerald-400' : status === 'error' ? 'text-red-400' : 'text-zinc-500'}`}>
                    {status === 'success' ? 'Mission Réussie' : status === 'error' ? 'Échec de Compilation' : 'En attente de code...'}
                  </h3>
                  {status === 'error' && (
                    <p className="text-[10px] text-red-300/60 font-bold uppercase mt-1">Reçu: "{errorDetails.received}" | Attendu: "{errorDetails.expected}"</p>
                  )}
                </div>
              </div>
              
              <button 
                disabled={status === 'running'}
                onClick={status === 'success' ? () => setView('map') : checkCode}
                className={`w-full md:w-auto px-16 py-5 rounded-[24px] font-black uppercase text-xs tracking-widest border-b-[6px] transition-all active:translate-y-1 active:border-b-0 disabled:opacity-50
                  ${status === 'success' ? 'bg-emerald-500 border-emerald-700 text-white' : 
                    status === 'error' ? 'bg-red-500 border-red-700 text-white' : 'bg-cyan-500 border-cyan-700 text-white'}`}
              >
                {status === 'running' ? "Exécution..." : status === 'success' ? "Continuer" : "Vérifier Code"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
