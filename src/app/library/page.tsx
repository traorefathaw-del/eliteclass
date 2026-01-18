"use client";
import { useState, useEffect } from "react";
import { Search, Plus, FileText, Download, X, UploadCloud, Loader2 } from "lucide-react";
// On garde ton import tel quel
import { createClient } from "../../utils/supabase"; 

export default function LibraryElite() {
  // CORRECTION : Initialisation indispensable pour éviter "supabase is not defined"
  const supabase = createClient();

  // États techniques
  const [searchTerm, setSearchTerm] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // États de la Modal d'ajout
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [newDoc, setNewDoc] = useState({ title: "", category: "" });

  useEffect(() => {
    const init = async () => {
      // Vérification de la session utilisateur
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      await fetchDocs();
    };
    init();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("library")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setDocuments(data);
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!file || !newDoc.title) return alert("Veuillez remplir le titre et choisir un fichier.");
    
    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
      
      // 1. Upload vers le Storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .upload(fileName, file);

      if (storageError) throw storageError;

      // 2. URL publique et insertion Base de données
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
      alert("Succès : Archive ajoutée !");
    } catch (err: any) {
      alert("Erreur : " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Sécurité Administrateur
  const isAdmin = user?.email === "traorefathaw@gmail.com";

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6 md:p-12 pt-24 selection:bg-cyan-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER & BARRE DE RECHERCHE */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
            Archives <span className="text-[#22d3ee] font-black">Elite</span>
          </h1>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Barre de recherche optimisée */}
            <div className="relative flex-1 md:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-slate-500" size={18} />
              </div>
              <input 
                type="text" 
                placeholder="RECHERCHER..."
                className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[11px] font-black tracking-widest outline-none focus:border-[#22d3ee]/50 transition-all placeholder:text-slate-600"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Bouton d'ajout */}
            {isAdmin && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-[#22d3ee] text-[#0a0f1a] p-4 rounded-2xl hover:brightness-110 transition-all shadow-lg active:scale-95 shadow-[#22d3ee]/20"
              >
                <Plus size={24} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>

        {/* LISTE DES DOCUMENTS */}
        {loading ? (
          <div className="flex justify-center py-20 opacity-30"><Loader2 className="animate-spin text-[#22d3ee]" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents
              .filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((doc) => (
              <div key={doc.id} className="bg-slate-900/30 border border-white/5 p-8 rounded-[2.5rem] group hover:border-[#22d3ee]/30 transition-all">
                <div className="flex justify-between mb-6">
                  <div className="p-4 bg-[#0a0f1a] rounded-2xl border border-white/5"><FileText className="text-[#22d3ee]" /></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{doc.size}</span>
                </div>
                <h3 className="text-xl font-black italic uppercase mb-8 leading-tight h-14 overflow-hidden tracking-tighter">
                  {doc.title}
                </h3>
                <a href={doc.download_url} target="_blank" className="w-full py-4 bg-white text-[#0a0f1a] rounded-2xl font-black text-[10px] uppercase flex justify-center items-center gap-2 hover:bg-[#22d3ee] hover:text-[#0a0f1a] transition-all shadow-lg">
                  <Download size={16} /> Télécharger
                </a>
              </div>
            ))}
          </div>
        )}

        {/* MODAL AJOUTER UN DOC */}
        {showAddModal && (
          <div className="fixed inset-0 bg-[#0a0f1a]/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
            <div className="bg-[#111827] border border-white/10 p-8 md:p-12 rounded-[3rem] max-w-md w-full relative shadow-2xl">
              <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X /></button>
              
              <h2 className="text-3xl font-black italic uppercase mb-10 tracking-tighter">Ajouter un <span className="text-[#22d3ee]">Doc</span></h2>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Titre</label>
                  <input type="text" placeholder="EX: GUIDE CYBER SÉCURITÉ" className="w-full bg-[#0a0f1a] border border-white/5 p-4 rounded-2xl font-bold uppercase text-xs outline-none focus:border-[#22d3ee] transition-all" onChange={e => setNewDoc({...newDoc, title: e.target.value})} />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Catégorie</label>
                  <input type="text" placeholder="EX: RÉSEAUX / DEV" className="w-full bg-[#0a0f1a] border border-white/5 p-4 rounded-2xl font-bold uppercase text-xs outline-none focus:border-[#22d3ee] transition-all" onChange={e => setNewDoc({...newDoc, category: e.target.value})} />
                </div>
                
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:bg-white/5 transition-all mt-4 group">
                  <UploadCloud className="text-[#22d3ee] mb-2 group-hover:scale-110 transition-transform" size={30} />
                  <span className="text-[10px] font-black uppercase text-slate-400 text-center px-4">
                    {file ? file.name : "Glisser le fichier PDF ici (Max 20MB)"}
                  </span>
                  <input type="file" className="hidden" accept=".pdf" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
                </label>

                <button 
                  onClick={handleUpload} 
                  disabled={uploading}
                  className="w-full py-5 bg-[#22d3ee] text-[#0a0f1a] rounded-2xl font-black uppercase text-[11px] tracking-widest hover:brightness-110 transition-all flex justify-center items-center gap-2 mt-6 shadow-lg shadow-[#22d3ee]/10"
                >
                  {uploading ? <Loader2 className="animate-spin" size={18} /> : "Enregistrer la ressource"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
