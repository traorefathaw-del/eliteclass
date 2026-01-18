"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase";
import { ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";

export default function VerifyOTP() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // Récupère l'email dans l'URL
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") || "");
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup',
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-6 font-sans selection:bg-[#22d3ee]/30">
      <div className="w-full max-w-md bg-[#111827] border border-white/5 p-10 rounded-[3rem] text-center relative overflow-hidden shadow-2xl">
        {/* Glow Effect */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#22d3ee]/10 blur-[60px]" />
        
        <div className="w-20 h-20 bg-[#22d3ee]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#22d3ee]/20">
          <ShieldCheck size={40} className="text-[#22d3ee]" />
        </div>

        <h1 className="text-3xl font-black italic uppercase mb-2 text-white tracking-tighter">Vérification</h1>
        <p className="text-slate-500 text-xs mb-8 font-mono">
          // Un code a été envoyé à <br/><span className="text-[#22d3ee] font-bold">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6 text-white">
          <input 
            type="text" 
            placeholder="000000" 
            maxLength={6}
            required
            className="w-full bg-[#0a0f1a] border border-white/10 rounded-2xl py-5 text-center text-2xl font-black tracking-[0.5em] outline-none focus:border-[#22d3ee] transition-all placeholder:text-slate-800"
            onChange={(e) => setOtp(e.target.value)}
          />

          {error && <p className="text-red-400 text-[10px] uppercase font-bold tracking-tighter italic">! {error}</p>}

          <button 
            disabled={loading}
            className="w-full py-5 bg-[#22d3ee] hover:brightness-110 text-[#0a0f1a] rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#22d3ee]/10 disabled:opacity-50 disabled:bg-slate-800"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <>Confirmer l'accès <ArrowRight size={18}/></>}
          </button>
        </form>
      </div>
    </div>
  );
}
