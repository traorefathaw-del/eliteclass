"use client";
import { useState, useEffect } from "react";
import { Search, Plus, FileText, Download, X, UploadCloud, Loader2, ShieldCheck, Activity, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "../../utils/supabase"; 

export default function LibraryElite() {
  const supabase = createClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [newDoc, setNewDoc] = useState({ title: "", category: "" });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      await fetchDocs();
    };
    init();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    const { data } = await supabase.from("library").select("*").order("created_at", { ascending: false });
    if (data) setDocuments(data);
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!file || !newDoc.title) return alert("Veuillez remplir le titre et choisir un fichier.");
    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
      const { error: storageError } = await supabase.storage.from("documents").upload(fileName, file);
      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage.from("documents").getPublicUrl(fileName);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";

      const { error: dbError } = await supabase.from("library").insert([{
        title: newDoc.title.toUpperCase(),
        category: newDoc.category.toUpperCase() || "RESSOURCE",
        size: sizeMB,
        download_url: urlData.publicUrl,
        type: "PDF"
      }]);
      if (dbError) throw dbError;

      setShowAddModal(false);
      setFile(null);
      fetchDocs();
    } catch (err: any) {
      alert("Erreur : " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const isAdmin = user?.email === "traorefathaw@gmail.com";

  return (
    <div className="min-h-screen bg-[#060a13] text-white p-6 md:p-12 pt-24 selection:bg-cyan-500/30 overflow-hidden relative">
      
      {/* BACKGROUND ATMOSPHÉRIQUE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER & RECHERCHE */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
             <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={18} className="text-cyan-400 animate-pulse" />
                <span className="text-cyan-400 font-mono text-[9px] tracking-[0.5em] uppercase opacity-70">Secure_Data_Vault</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
               Archives <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Elite</span>
             </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 w-full lg:w-auto"
          >
            <div className="relative flex-1 lg:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
              </div>
              <input 
                type="text" 
                placeholder="RECHERCHER DANS LE VAULT..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-[11px] font-black tracking-widest outline-none focus:border-cyan-400/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isAdmin && (
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34,211,238,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="bg-cyan-400 text-[#0a0f1a] p-5 rounded-2xl transition-all shadow-lg group"
              >
                <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* GRILLE DE DOCUMENTS */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-cyan-400" size={40} />
            <span className="text-[10px] font-mono tracking-widest text-slate-500 animate-pulse">DECRYPTING_FILES...</span>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
                {documents
                .filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((doc, idx) => (
                <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={doc.id} 
                    className="group relative bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] overflow-hidden transition-all hover:bg-white/[0.04] hover:border-cyan-500/30 shadow-2xl"
                >
                    {/* Effet Scan line au hover */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/30 -translate-y-full group-hover:animate-scan z-20" />
                    
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 group-hover:border-cyan-500/50 transition-colors shadow-inner">
                            <FileText className="text-cyan-400 group-hover:animate-pulse" size={24} />
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mb-1">Poids_Data</p>
                            <span className="text-[10px] font-mono text-cyan-400/70">{doc.size}</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-black italic uppercase mb-10 leading-tight tracking-tighter group-hover:text-cyan-50 transition-colors h-14 overflow-hidden">
                        {doc.title}
                    </h3>

                    <a 
                        href={doc.download_url} 
                        target="_blank" 
                        className="relative w-full py-4 bg-white text-[#0a0f1a] rounded-2xl font-black text-[10px] uppercase flex justify-center items-center gap-3 overflow-hidden group/btn transition-all active:scale-95 shadow-xl hover:bg-cyan-400"
                    >
                        <Download size={16} className="group-hover/btn:-translate-y-1 transition-transform" />
                        Accéder à l'archive
                    </a>
                </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* MODAL AJOUT (INTERFACE DE FORGE) */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#060a13]/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                className="bg-[#0d1424] border border-white/10 p-10 md:p-14 rounded-[3.5rem] max-w-lg w-full relative shadow-[0_0_100px_rgba(0,0,0,0.5)]"
              >
                <button onClick={() => setShowAddModal(false)} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors">
                  <X size={28} />
                </button>
                
                <h2 className="text-4xl font-black italic uppercase mb-12 tracking-tighter leading-none">
                  Injecter <span className="text-cyan-400">Data</span>
                </h2>
                
                <div className="space-y-6">
                  <div className="group">
                    <label className="text-[9px] font-black text-slate-600 uppercase ml-4 mb-2 block tracking-widest group-focus-within:text-cyan-400 transition-colors">Titre de l'archive</label>
                    <input type="text" placeholder="NOM DU DOSSIER..." className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl font-bold uppercase text-xs outline-none focus:border-cyan-400 transition-all text-cyan-50" onChange={e => setNewDoc({...newDoc, title: e.target.value})} />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-600 uppercase ml-4 mb-2 block tracking-widest">Classification</label>
                    <input type="text" placeholder="EX: CYBER / RÉSEAUX" className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl font-bold uppercase text-xs outline-none focus:border-cyan-400 transition-all text-cyan-50" onChange={e => setNewDoc({...newDoc, category: e.target.value})} />
                  </div>
                  
                  <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-white/10 rounded-[2.5rem] cursor-pointer hover:bg-cyan-500/[0.02] hover:border-cyan-400/50 transition-all mt-6 group/upload relative overflow-hidden">
                    <UploadCloud className="text-cyan-400 mb-3 group-hover/upload:-translate-y-2 transition-transform" size={32} />
                    <span className="text-[10px] font-black uppercase text-slate-500 text-center px-8 leading-relaxed">
                      {file ? file.name : "Glisser le binaire PDF ici (Max 20MB)"}
                    </span>
                    <input type="file" className="hidden" accept=".pdf" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
                  </label>

                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleUpload} 
                    disabled={uploading}
                    className="w-full py-6 bg-cyan-400 text-[#0a0f1a] rounded-[2rem] font-black uppercase text-[12px] tracking-[0.3em] transition-all flex justify-center items-center gap-3 mt-10 shadow-xl shadow-cyan-400/20 disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <><Activity size={18} /> Sceller dans le Vault</>}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
        .animate-scan { animation: scan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
}
