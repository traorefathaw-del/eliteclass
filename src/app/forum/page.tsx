"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, ArrowLeft, Send, X, Inbox, Loader2, User, ImageIcon } from "lucide-react";
import { createClient } from "../../utils/supabase"; 

export default function ForumEliteFinal() {
  const supabase = createClient();

  const [view, setView] = useState<"list" | "read" | "ask">("list");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showAll, setShowAll] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [newQuestion, setNewQuestion] = useState({ title: "", content: "", tags: "", author: "" });
  const [replyForm, setReplyForm] = useState({ author: "", text: "" });

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("discussions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setDiscussions(data);
    } catch (err) {
      console.error("Erreur de chargement:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchDiscussions(); }, []);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data, error } = await supabase.storage.from('forum-images').upload(fileName, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('forum-images').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  // FONCTION DE PUBLICATION MISE À JOUR
  const handlePostQuestion = async () => {
    // Vérification stricte pour éviter les publications vides
    if (!newQuestion.title.trim() || !newQuestion.content.trim() || !newQuestion.author.trim()) {
      alert("Veuillez remplir les champs obligatoires : Pseudo, Titre et Message.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase.from("discussions").insert([{
        title: newQuestion.title.toUpperCase(),
        content: newQuestion.content,
        author: newQuestion.author,
        image_url: imageUrl,
        tags: newQuestion.tags ? newQuestion.tags.split(",").map(t => t.trim().toUpperCase()) : ["GÉNÉRAL"],
        replies: []
      }]);

      if (error) throw error;

      // Succès : Rafraîchissement et retour à la liste
      await fetchDiscussions();
      setNewQuestion({ title: "", content: "", tags: "", author: "" });
      setImageFile(null);
      setView("list");
      
    } catch (err: any) {
      console.error("Erreur publication:", err);
      alert("Erreur lors de l'envoi : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async () => {
    if (!replyForm.text.trim() || !replyForm.author.trim()) return;
    setIsSubmitting(true);
    
    const newReply = { 
        author: replyForm.author, 
        text: replyForm.text, 
        date: new Date().toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
    };
    
    const updatedReplies = [...(selectedPost.replies || []), newReply];
    
    const { error } = await supabase
      .from("discussions")
      .update({ replies: updatedReplies })
      .eq("id", selectedPost.id);

    if (!error) {
      setSelectedPost({ ...selectedPost, replies: updatedReplies });
      setReplyForm({ ...replyForm, text: "" });
      fetchDiscussions();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6 pt-24 font-sans selection:bg-cyan-500/30">
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          
          {view === "list" && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Elite<span className="text-[#22d3ee]">.</span>Talk</h1>
                  <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] mt-4 font-black italic">Communauté de partage</p>
                </div>
                <button onClick={() => setView("ask")} className="bg-white text-[#0a0f1a] hover:bg-[#22d3ee] hover:text-[#0a0f1a] px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-white/5">
                  <Plus size={18} className="inline mr-2" /> Poser une question
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-32 opacity-20"><Loader2 className="animate-spin text-[#22d3ee]" size={40} /></div>
              ) : (
                <div className="grid gap-4">
                  {discussions.slice(0, showAll ? undefined : 4).map((post) => (
                    <div key={post.id} onClick={() => { setSelectedPost(post); setView("read"); }} className="p-8 bg-slate-900/20 border border-white/5 rounded-[2.5rem] cursor-pointer hover:border-[#22d3ee]/30 transition-all group">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 group-hover:text-[#22d3ee]">{post.title}</h3>
                          <div className="flex items-center gap-4 text-slate-600 font-black text-[10px] uppercase">
                            <span className="text-[#22d3ee]">@{post.author}</span>
                            <span>• {post.replies?.length || 0} RÉPONSES</span>
                          </div>
                        </div>
                        <MessageSquare size={24} className="text-slate-800 group-hover:text-[#22d3ee]" />
                      </div>
                    </div>
                  ))}

                  {!showAll && discussions.length > 4 && (
                    <button 
                      onClick={() => setShowAll(true)} 
                      className="w-full py-6 text-slate-500 hover:text-[#22d3ee] font-black uppercase text-[10px] tracking-[0.4em] transition-all"
                    >
                      + Afficher les autres discussions ({discussions.length - 4})
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {view === "ask" && (
            <motion.div key="ask" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-4">
              <div className="flex justify-between items-center mb-10 text-4xl font-black italic uppercase">
                <h2>Nouveau <span className="text-[#22d3ee]">Ticket</span></h2>
                <button onClick={() => setView("list")} className="text-slate-700 hover:text-white transition-colors"><X size={32}/></button>
              </div>
              <input type="text" placeholder="VOTRE PSEUDO" className="w-full bg-slate-900 border border-white/5 p-5 rounded-2xl outline-none focus:border-[#22d3ee] font-black uppercase text-xs transition-all" value={newQuestion.author} onChange={(e)=>setNewQuestion({...newQuestion, author: e.target.value})} />
              <input type="text" placeholder="TITRE DE LA QUESTION" className="w-full bg-slate-900 border border-white/5 p-6 rounded-2xl outline-none focus:border-[#22d3ee] font-black italic uppercase text-lg transition-all" value={newQuestion.title} onChange={(e)=>setNewQuestion({...newQuestion, title: e.target.value})} />
              <textarea placeholder="DÉTAILLEZ VOTRE PROBLÈME..." className="w-full bg-slate-900 border border-white/5 p-8 rounded-[2rem] outline-none min-h-[200px] focus:border-[#22d3ee] text-sm transition-all" value={newQuestion.content} onChange={(e)=>setNewQuestion({...newQuestion, content: e.target.value})} />
              
              <div className="relative group">
                <label className="flex items-center gap-4 w-full bg-slate-900/50 border border-dashed border-white/10 p-6 rounded-2xl cursor-pointer hover:border-[#22d3ee]/50 transition-all">
                  <ImageIcon className="text-slate-600 group-hover:text-[#22d3ee]" />
                  <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">
                    {imageFile ? imageFile.name : "Ajouter une image illustrative"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              <button disabled={isSubmitting} onClick={handlePostQuestion} className="w-full bg-[#22d3ee] text-[#0a0f1a] p-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-50">
                {isSubmitting ? "ENVOI EN COURS..." : "PUBLIER LA QUESTION"}
              </button>
            </motion.div>
          )}

          {view === "read" && (
            <motion.div key="read" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 font-black uppercase text-[10px] hover:text-white transition-colors"><ArrowLeft size={16} /> Retour à la liste</button>
              
              <div className="p-10 bg-slate-900/30 border border-white/5 rounded-[3.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-[#22d3ee]/10"><MessageSquare size={120} /></div>
                <div className="flex items-center gap-3 text-[#22d3ee] font-black text-[10px] uppercase mb-4">
                  <User size={14} /> @{selectedPost.author}
                </div>
                <h2 className="text-5xl font-black italic uppercase mb-6 leading-none relative z-10 tracking-tighter">{selectedPost.title}</h2>
                
                {selectedPost.image_url && (
                  <div className="mb-8 relative z-10 rounded-3xl overflow-hidden border border-white/10">
                    <img src={selectedPost.image_url} alt="Illustration" className="w-full h-auto object-cover max-h-[500px]" />
                  </div>
                )}

                <p className="text-slate-300 text-lg leading-relaxed relative z-10">{selectedPost.content}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-slate-500 font-black uppercase text-[10px] tracking-widest ml-4">
                  {selectedPost.replies?.length || 0} Réponses trouvées
                </h3>
                
                {selectedPost.replies && selectedPost.replies.length > 0 ? (
                  selectedPost.replies.map((reply: any, index: number) => (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} key={index} className="p-8 bg-slate-900/10 border border-white/5 rounded-[2.5rem]">
                      <div className="flex justify-between items-center mb-4 font-black text-[9px] uppercase tracking-widest">
                        <span className="text-[#22d3ee]">@{reply.author}</span>
                        <span className="text-slate-600">{reply.date}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{reply.text}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-10 text-center text-slate-700 font-black uppercase text-[10px] tracking-widest">
                    Aucune réponse pour le moment...
                  </div>
                )}
              </div>

              <div className="mt-12 bg-[#111827] border border-white/5 rounded-[3rem] p-4 shadow-2xl">
                <input type="text" placeholder="VOTRE PSEUDO..." className="bg-transparent px-8 py-4 w-full outline-none font-black uppercase text-[10px] border-b border-white/5 mb-2 focus:text-[#22d3ee] transition-colors" value={replyForm.author} onChange={(e)=>setReplyForm({...replyForm, author: e.target.value})} />
                <textarea value={replyForm.text} onChange={(e)=>setReplyForm({...replyForm, text: e.target.value})} placeholder="ÉCRIVEZ VOTRE RÉPONSE ICI..." className="w-full bg-transparent p-8 outline-none text-sm min-h-[150px] focus:text-slate-200 transition-colors" />
                <div className="flex justify-end p-4">
                  <button disabled={isSubmitting} onClick={handleReply} className="bg-[#22d3ee] text-[#0a0f1a] px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:brightness-110 transition-all active:scale-95 disabled:opacity-50">
                    {isSubmitting ? "ENVOI..." : "PUBLIER LA RÉPONSE"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
