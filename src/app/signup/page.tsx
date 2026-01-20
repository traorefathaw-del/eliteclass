"use client";
import { useState } from "react";
import { createClient} from "@/utils/supabase";
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, KeyRound } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accessKey: "", // Champ vide par défaut
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const cleanKey = formData.accessKey.toUpperCase().trim();

      // 1. Vérification de la clé dans la table access_keys
      const { data: keyData, error: keyError } = await supabase
        .from("access_keys")
        .select("*")
        .eq("code", cleanKey)
        .eq("is_active", true)
        .single();

      if (keyError || !keyData) {
        throw new Error("Clé d'accès invalide ou quota atteint.");
      }

      // 2. Création du compte utilisateur
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
          },
        },
      });

      if (signupError) throw signupError;

      // 3. Mise à jour du compteur d'utilisations de la clé
      await supabase
        .from("access_keys")
        .update({ current_uses: keyData.current_uses + 1 })
        .eq("id", keyData.id);

      window.location.href = `/verify?email=${encodeURIComponent(formData.email)}`;

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-4 font-sans selection:bg-[#22d3ee]/30">
      <div className="w-full max-w-xl bg-[#111827] border border-white/5 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#22d3ee]/10 blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#22d3ee]/5 blur-[120px]" />

        <div className="relative z-10 text-white">
          <header className="mb-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
               <div className="p-3 bg-[#22d3ee] rounded-2xl shadow-xl shadow-[#22d3ee]/20">
                  <ShieldCheck size={24} className="text-[#0a0f1a]"/>
               </div>
               <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Elite Registry</h1>
            </div>
          </header>

          <form onSubmit={handleSignUp} className="space-y-6">
            
            {/* CHAMP CLÉ D'ACCÈS REQUISE (Vide avec icône) */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#22d3ee] ml-4 italic">
                Clé d'accès requise
              </label>
              <div className="relative group">
                <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-[#22d3ee]/40 group-focus-within:text-[#22d3ee] transition-colors" size={20} />
                <input 
                  type="text" 
                  required 
                  value={formData.accessKey}
                  className="w-full bg-[#22d3ee]/5 border border-[#22d3ee]/20 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none focus:border-[#22d3ee] text-sm transition-all text-white font-mono placeholder:text-slate-700 uppercase"
                  placeholder="XXXXX"
                  onChange={(e) => setFormData({...formData, accessKey: e.target.value})}
                />
              </div>
            </div>

            {/* PRÉNOM & NOM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Prénom</label>
                <input 
                  type="text" required 
                  value={formData.firstName}
                  className="w-full bg-[#0a0f1a]/50 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-[#22d3ee]/50 text-sm transition-all text-white"
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Nom</label>
                <input 
                  type="text" required 
                  value={formData.lastName}
                  className="w-full bg-[#0a0f1a]/50 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-[#22d3ee]/50 text-sm transition-all text-white"
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="email" required 
                  value={formData.email}
                  className="w-full bg-[#0a0f1a]/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-[#22d3ee]/50 text-sm transition-all text-white"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* MOT DE PASSE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="password" required minLength={6}
                  value={formData.password}
                  className="w-full bg-[#0a0f1a]/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-[#22d3ee]/50 text-sm transition-all text-white"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-bold uppercase tracking-tight flex items-center gap-2">
                <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full py-5 bg-[#22d3ee] hover:bg-[#22d3ee]/90 text-[#0a0f1a] disabled:bg-slate-800 disabled:text-slate-500 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-[#22d3ee]/20 group"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>Démarrer la session <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <footer className="mt-8 text-center flex flex-col gap-4">
            <div className="h-[1px] w-12 bg-white/10 mx-auto" />
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
              Déjà enregistré ? <Link href="/login" className="text-[#22d3ee] hover:text-white ml-2 italic transition-colors">Connexion</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
