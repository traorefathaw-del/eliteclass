"use client";
import { useState, useEffect } from "react";
import { FileText, Download, Search, Book, Code, Terminal, ExternalLink, Plus, Loader2, X } from "lucide-react";
import { createClient } from "../../utils/supabase";

export default function LibraryElite() {
  const supabase = createClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // État pour le formulaire d'ajout (Admin seulement)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: "", type: "PDF", size: "", category: "", download_url: "" });

  useEffect(() => {
    fetchDocs();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchDocs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("library").select("*").order("created_at", { ascending: false });
    if (!error) setDocuments(data || []);
    setLoading(false);
  };

  const handleAddDocument = async () => {
    const { error } = await supabase.from("library").insert([newDoc]);
    if (!error) {
      setShowAddModal(false);
      fetchDocs();
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Vérification si vous êtes l'admin
  const isAdmin = user?.email === "traorefathaw@gmail.com";

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 md:p-16 pt-24">
      <div className="max-w-6xl mx-auto">
        
        {/* EN-TÊTE */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4 leading-none">
              Archives <span className="text-blue-600 not-italic font-sans">Elite</span>
            </h1>
            <p className="text-slate-500 font-mono text-[10px] tracking-[0.3em] uppercase">
               {isAdmin ? "ADMINISTRATEUR CONNECTÉE" : "Répertoire central des connaissances"}
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-all text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isAdmin && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 p-4 rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
              >
                <Plus size={24} />
              </button>
            )}
          </div>
        </div>

        {/* GRILLE */}
        {loading ? (
          <div className="flex justify-center py-20 opacity-20"><Loader2 className="animate-spin" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="group bg-slate-900/20 border border-white/5 p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
                    {doc.category === "Système" ? <Terminal className="text-blue-400" /> : <FileText className="text-purple-400" />}
                  </div>
                  <span className="text-[9px] font-black px-3 py-1 bg-white/5 rounded-full text-slate-500 uppercase">{doc.type}</span>
                </div>
                <h3 className="text-xl font-black mb-2 italic uppercase tracking-tighter leading-tight">{doc.title}</h3>
                <div className="text-[10px] font-mono text-slate-600 mb-8 uppercase flex gap-3">
                   <span>{doc.category}</span> <span>•</span> <span>{doc.size}</span>
                </div>
                <a 
                  href={doc.download_url} 
                  target="_blank"
                  className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Download size={16} /> Télécharger
                </a>
              </div>
            ))}
          </div>
        )}

        {/* MODAL AJOUT (VISIBLE UNIQUEMENT PAR VOUS) */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-[#020617] border border-white/10 p-10 rounded-[3rem] max-w-md w-full relative">
              <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X /></button>
              <h2 className="text-3xl font-black italic uppercase mb-8">Ajouter un <span className="text-blue-500">Doc</span></h2>
              <div className="space-y-4">
                <input type="text" placeholder="TITRE" className="w-full bg-slate-900 border border-white/5 p-4 rounded-xl outline-none focus:border-blue-500 font-bold uppercase text-xs" onChange={e => setNewDoc({...newDoc, title: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="TYPE (PDF...)" className="w-full bg-slate-900 border border-white/5 p-4 rounded-xl outline-none text-xs font-bold" onChange={e => setNewDoc({...newDoc, type: e.target.value})} />
                  <input type="text" placeholder="TAILLE (2MB)" className="w-full bg-slate-900 border border-white/5 p-4 rounded-xl outline-none text-xs font-bold" onChange={e => setNewDoc({...newDoc, size: e.target.value})} />
                </div>
                <input type="text" placeholder="CATÉGORIE" className="w-full bg-slate-900 border border-white/5 p-4 rounded-xl outline-none text-xs font-bold" onChange={e => setNewDoc({...newDoc, category: e.target.value})} />
                <input type="text" placeholder="URL DE TÉLÉCHARGEMENT" className="w-full bg-slate-900 border border-white/5 p-4 rounded-xl outline-none text-xs font-bold" onChange={e => setNewDoc({...newDoc, download_url: e.target.value})} />
                <button onClick={handleAddDocument} className="w-full py-5 bg-blue-600 rounded-2xl font-black uppercase text-xs tracking-widest">Enregistrer la ressource</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
