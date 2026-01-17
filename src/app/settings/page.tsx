"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase";
import { Bell, Lock, Eye, Globe, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const supabase = createClient();
  const router = useRouter();

  // 1. Réinitialisation du mot de passe (Sécurité)
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

  // 2. Suppression du compte (Zone de danger)
  const handleDeleteAccount = async () => {
    const confirm = window.confirm("ATTENTION : Cette action est irréversible. Supprimer votre compte ?");
    if (!confirm) return;

    setLoading(true);
    // Note : La suppression de compte côté client nécessite souvent une Edge Function 
    // ou une API route pour des raisons de sécurité. Ici on simule l'appel.
    setMessage({ type: 'error', text: "Contactez l'administrateur pour la suppression définitive." });
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none text-white">
          Configuration<br/><span className="text-blue-600">Système.</span>
        </h1>
      </header>

      {/* Affichage des messages de statut */}
      {message && (
        <div className={`p-4 rounded-2xl border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} text-[10px] font-black uppercase tracking-widest flex items-center gap-3`}>
          <CheckCircle2 size={16} /> {message.text}
        </div>
      )}

      <div className="space-y-4">
        {/* NOTIFICATIONS */}
        <div className="group flex items-center justify-between p-6 bg-slate-900/40 border border-white/5 rounded-[2rem] hover:bg-white/5 transition-all">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500"><Bell size={20} /></div>
            <div>
              <h3 className="font-black italic uppercase text-sm text-white">Notifications</h3>
              <p className="text-slate-500 text-xs">Push et Emails activés</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* SÉCURITÉ (FONCTIONNEL) */}
        <button 
          onClick={handlePasswordReset}
          disabled={loading}
          className="w-full group flex items-center justify-between p-6 bg-slate-900/40 border border-white/5 rounded-[2rem] hover:bg-white/5 transition-all text-left"
        >
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
            </div>
            <div>
              <h3 className="font-black italic uppercase text-sm text-white">Sécurité</h3>
              <p className="text-slate-500 text-xs">Mettre à jour le mot de passe</p>
            </div>
          </div>
          <span className="text-blue-500 font-bold text-xs">MODIFIER</span>
        </button>

        {/* LANGUE */}
        <div className="group flex items-center justify-between p-6 bg-slate-900/40 border border-white/5 rounded-[2rem] hover:bg-white/5 transition-all">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500"><Globe size={20} /></div>
            <div>
              <h3 className="font-black italic uppercase text-sm text-white">Langue & Région</h3>
              <select className="bg-transparent text-slate-500 text-xs outline-none cursor-pointer">
                <option>Français (FR)</option>
                <option>English (US)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE DE DANGER (FONCTIONNEL) */}
      <div className="mt-16 p-8 border border-red-500/20 bg-red-500/5 rounded-[2.5rem]">
        <h3 className="text-red-500 font-black italic uppercase text-sm mb-4 flex items-center gap-2">
          <Trash2 size={18} /> Zone de Danger
        </h3>
        <p className="text-slate-500 text-xs mb-6">La suppression est irréversible. Vos certificats et points seront effacés.</p>
        <button 
          onClick={handleDeleteAccount}
          className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
        >
          Supprimer mon compte définitivement
        </button>
      </div>
    </div>
  );
}
