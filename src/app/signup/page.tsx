"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase";
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error: signupError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_name: `${formData.firstName} ${formData.lastName}`,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
    } else {
      window.location.href = `/verify?email=${encodeURIComponent(formData.email)}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans selection:bg-blue-500/30">
      <div className="w-full max-w-xl bg-slate-950 border border-white/5 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/5 blur-[120px]" />

        <div className="relative z-10 text-white">
          <header className="mb-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
               <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20">
                  <ShieldCheck size={24}/>
               </div>
               <h1 className="text-3xl font-black italic uppercase tracking-tighter">Elite Registry</h1>
            </div>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">
                // ACCÈS SÉCURISÉ
            </p>
          </header>

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* PRÉNOM & NOM SANS ICÔNES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Prénom</label>
                <input 
                  type="text" required 
                  value={formData.firstName}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-blue-500/50 text-sm transition-all focus:ring-1 ring-blue-500/20 text-white"
                  placeholder=""
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Nom</label>
                <input 
                  type="text" required 
                  value={formData.lastName}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-blue-500/50 text-sm transition-all focus:ring-1 ring-blue-500/20 text-white"
                  placeholder=""
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            {/* EMAIL AVEC ICÔNE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="email" required 
                  value={formData.email}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-blue-500/50 text-sm transition-all focus:ring-1 ring-blue-500/20 text-white"
                  placeholder=""
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* MOT DE PASSE AVEC ICÔNE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="password" required minLength={6}
                  value={formData.password}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-blue-500/50 text-sm transition-all focus:ring-1 ring-blue-500/20 text-white"
                  placeholder=""
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-bold uppercase tracking-tight flex items-center gap-2">
                <div className="w-1 h-1 bg-red-400 rounded-full" />
                {error}
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20 group"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>Démarrer la session <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <footer className="mt-8 text-center flex flex-col gap-4">
            <div className="h-[1px] w-12 bg-white/10 mx-auto" />
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
              Déjà enregistré ? <Link href="/login" className="text-blue-500 hover:text-white ml-2 italic transition-colors">Connexion</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
