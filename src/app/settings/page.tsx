"use client";
import { useState } from "react";
import { createClient} from "@/utils/supabase";
import { Bell, Lock, Eye, Globe, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const supabase = createClient();
  const router = useRouter();

  // 1. Réinitialisation du mot de passe
  const handlePasswordReset = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user?.email) {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) setMessage({ type: 'error', text: error.message });
      else setMessage({ type: 'success', text: "Lien de réinitialisation envoyé par email !" });
    }
    setLoading(false);
  };

  // 2. Suppression du compte
  const handleDeleteAccount = async () => {
    const confirm = window.confirm("ATTENTION : Cette action est irréversible. Supprimer votre compte ?");
    if (!confirm) return;

    setLoading(true);
    setMessage({ type: 'error', text: "Contactez l'administrateur pour la suppression définitive." });
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen font-sans selection:bg-[#22d3ee]/30">
      {/* FOND FIGÉ */}
      <div className="fixed inset-0 bg-[#0a0f1a] -z-10" />

      <div className="p-8 max-w-4xl mx-auto space-y-10 pt-24 pb-12">
        <header>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-black italic uppercase tracking-tighter leading-none text-white"
          >
            Configuration<br/><span className="text-[#22d3ee]">Système.</span>
          </motion.h1>
        </header>

        {/* Affichage des messages de statut */}
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} text-[10px] font-black uppercase tracking-widest flex items-center gap-3`}
          >
            <CheckCircle2 size={16} /> {message.text}
          </motion.div>
        )}

        <div className="space-y-4">
          {/* NOTIFICATIONS */}
          <div className="group flex items-center justify-between p-6 bg-[#111827]/40 backdrop-blur-sm border border-white/5 rounded-[2.5rem] hover:border-[#22d3ee]/20 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center text-[#22d3ee] shadow-inner">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="font-black italic uppercase text-sm text-white">Notifications</h3>
                <p className="text-slate-500 text-xs">Push et Emails activés</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22d3ee]"></div>
            </label>
          </div>

          {/* SÉCURITÉ */}
          <button 
            onClick={handlePasswordReset}
            disabled={loading}
            className="w-full group flex items-center justify-between p-6 bg-[#111827]/40 backdrop-blur-sm border border-white/5 rounded-[2.5rem] hover:border-[#22d3ee]/20 transition-all text-left"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center text-[#22d3ee] shadow-inner">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
              </div>
              <div>
                <h3 className="font-black italic uppercase text-sm text-white">Sécurité</h3>
                <p className="text-slate-500 text-xs">Mettre à jour le mot de passe</p>
              </div>
            </div>
            <span className="text-[#22d3ee] font-black text-[10px] tracking-widest group-hover:translate-x-1 transition-transform">MODIFIER</span>
          </button>

          {/* LANGUE */}
          <div className="group flex items-center justify-between p-6 bg-[#111827]/40 backdrop-blur-sm border border-white/5 rounded-[2.5rem] hover:border-[#22d3ee]/20 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center text-[#22d3ee] shadow-inner">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="font-black italic uppercase text-sm text-white">Langue & Région</h3>
                <select className="bg-transparent text-slate-500 text-xs font-bold outline-none cursor-pointer hover:text-white transition-colors">
                  <option className="bg-[#0a0f1a]">Français (FR)</option>
                  <option className="bg-[#0a0f1a]">English (US)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ZONE DE DANGER */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 p-8 border border-red-500/20 bg-red-500/5 rounded-[3rem] backdrop-blur-md"
        >
          <h3 className="text-red-500 font-black italic uppercase text-sm mb-4 flex items-center gap-2">
            <Trash2 size={18} /> Zone de Danger
          </h3>
          <p className="text-slate-500 text-xs mb-6">La suppression est irréversible. Vos certificats et points seront effacés de la base de données.</p>
          <button 
            onClick={handleDeleteAccount}
            className="w-full md:w-auto px-8 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95"
          >
            Supprimer mon compte définitivement
          </button>
        </motion.div>
      </div>
    </div>
  );
}
