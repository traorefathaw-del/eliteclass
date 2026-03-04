"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Plus, ArrowLeft, Send, X, Inbox, 
  Loader2, User, ImageIcon, ChevronRight, Activity, Cpu 
} from "lucide-react";
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

  const handlePostQuestion = async () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim() || !newQuestion.author.trim()) {
      alert("Veuillez remplir les champs obligatoires.");
      return;
    }
    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (imageFile) imageUrl = await uploadImage(imageFile);
      const { error } = await supabase.from("discussions").insert([{
        title: newQuestion.title.toUpperCase(),
        content: newQuestion.content,
        author: newQuestion.author,
        image_url: imageUrl,
        tags: newQuestion.tags ? newQuestion.tags.split(",").map(t => t.trim().toUpperCase()) : ["GÉNÉRAL"],
        replies: []
      }]);
      if (error) throw error;
      await fetchDiscussions();
      setNewQuestion({ title: "", content: "", tags: "", author: "" });
      setImageFile(null);
      setView("list");
    } catch (err: any) {
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
    const { error } = await supabase.from("discussions").update({ replies: updatedReplies }).eq("id", selectedPost.id);
    if (!error) {
      setSelectedPost({ ...selectedPost, replies: updatedReplies });
      setReplyForm({ ...replyForm, text: "" });
      fetchDiscussions();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white p-4 md:p-6 pt-20 md:pt-24 font-sans selection:bg-cyan-500/30 relative overflow-x-hidden">
      
      {/* GLOW BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] md:w-[40%] h-[40%] bg-cyan-500/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          
          {view === "list" && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 md:mb-12 gap-6">
                <div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">Elite<span className="text-cyan-400">.</span>Talk</h1>
                  <p className="text-slate-500 uppercase tracking-[0.3em] text-[8px] md:text-[10px] mt-3 md:mt-4 font-black italic">PHASE_NEURAL_FORUM</p>
                </div>
                <button onClick={() => setView("ask")} className="w-full md:w-auto bg-white text-[#0a0f1a] hover:bg-cyan-400 px-6 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center">
                  <Plus size={18} className="mr-2" /> Poser une question
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {loading ? (
                    <div className="flex justify-center py-20 md:py-32 opacity-20"><Loader2 className="animate-spin text-cyan-400" size={40} /></div>
                  ) : (
                    discussions.slice(0, showAll ? undefined : 6).map((post) => (
                      <div key={post.id} onClick={() => { setSelectedPost(post); setView("read"); }} className="p-5 md:p-8 bg-[#0d1424] border border-white/5 rounded-2xl md:rounded-[2.5rem] cursor-pointer hover:border-cyan-400/30 transition-all group flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 md:mb-3">
                             <span className="text-slate-600 font-mono text-[8px] md:text-[9px] uppercase tracking-widest truncate">SYNC_NODE_{String(post.id).slice(0,5)}</span>
                          </div>
                          <h3 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter group-hover:text-cyan-400 transition-colors truncate">{post.title}</h3>
                          <div className="flex items-center gap-3 md:gap-4 text-slate-500 font-black text-[9px] md:text-[10px] uppercase">
                            <span className="text-cyan-400 truncate">@{post.author}</span>
                            <span className="whitespace-nowrap">• {post.replies?.length || 0} RÉPONSES</span>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-slate-800 group-hover:text-cyan-400 transition-all flex-shrink-0" />
                      </div>
                    ))
                  )}

                  {!showAll && discussions.length > 6 && (
                    <button onClick={() => setShowAll(true)} className="w-full py-4 md:py-6 text-slate-500 hover:text-cyan-400 font-black uppercase text-[9px] md:text-[10px] tracking-[0.4em] transition-all">
                      + Voir plus ({discussions.length - 6})
                    </button>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <div className="p-6 md:p-8 bg-[#0d1424] border border-white/5 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden">
                    <h4 className="text-cyan-400 font-black uppercase text-[10px] tracking-widest mb-4 md:mb-6 flex items-center gap-2">
                      <Activity size={14} /> Etat du Système
                    </h4>
                    <div className="space-y-3 relative z-10 font-black uppercase text-[10px] md:text-[11px]">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-500">Flux Nodes</span>
                        <span>{discussions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Status</span>
                        <span className="text-emerald-400">Stable</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === "ask" && (
            <motion.div key="ask" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
              <div className="bg-[#0d1424] border border-white/5 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl">
                <div className="flex justify-between items-center mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">Nouveau <span className="text-cyan-400">Ticket</span></h2>
                  <button onClick={() => setView("list")} className="text-slate-700 hover:text-white transition-colors"><X size={28}/></button>
                </div>
                
                <div className="space-y-4">
                  <input type="text" placeholder="PSEUDO" className="w-full bg-[#060a13] border border-white/5 p-4 md:p-5 rounded-xl md:rounded-2xl outline-none focus:border-cyan-400 font-black uppercase text-[10px] transition-all" value={newQuestion.author} onChange={(e)=>setNewQuestion({...newQuestion, author: e.target.value})} />
                  <input type="text" placeholder="TITRE" className="w-full bg-[#060a13] border border-white/5 p-4 md:p-6 rounded-xl md:rounded-2xl outline-none focus:border-cyan-400 font-black italic uppercase text-base md:text-lg transition-all" value={newQuestion.title} onChange={(e)=>setNewQuestion({...newQuestion, title: e.target.value})} />
                  <textarea placeholder="MESSAGE..." className="w-full bg-[#060a13] border border-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] outline-none min-h-[150px] md:min-h-[200px] focus:border-cyan-400 text-sm transition-all" value={newQuestion.content} onChange={(e)=>setNewQuestion({...newQuestion, content: e.target.value})} />
                  
                  <label className="flex items-center gap-3 w-full bg-[#060a13]/50 border border-dashed border-white/10 p-4 md:p-6 rounded-xl md:rounded-2xl cursor-pointer hover:border-cyan-400 transition-all text-slate-500 font-black uppercase text-[9px] tracking-widest overflow-hidden">
                    <ImageIcon size={18} className="flex-shrink-0" />
                    <span className="truncate">{imageFile ? imageFile.name : "Ajouter une image"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                  </label>

                  <button disabled={isSubmitting} onClick={handlePostQuestion} className="w-full bg-white text-[#0a0f1a] p-5 md:p-6 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-cyan-400 transition-all">
                    {isSubmitting ? "ENVOI..." : "PUBLIER LE TICKET"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {view === "read" && (
            <motion.div key="read" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 font-black uppercase text-[9px] md:text-[10px] hover:text-white transition-colors">
                  <ArrowLeft size={16} /> Retour
                </button>
                
                <div className="p-6 md:p-10 bg-[#0d1424] border border-white/5 rounded-[2rem] md:rounded-[3.5rem] relative overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 text-cyan-400 font-black text-[9px] md:text-[10px] uppercase mb-4">
                    <User size={12} /> @{selectedPost.author}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black italic uppercase mb-6 leading-tight tracking-tighter">{selectedPost.title}</h2>
                  
                  {selectedPost.image_url && (
                    <div className="mb-6 md:mb-8 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10">
                      <img src={selectedPost.image_url} alt="Illustration" className="w-full h-auto object-cover max-h-[400px]" />
                    </div>
                  )}

                  <p className="text-slate-300 text-base md:text-lg leading-relaxed">{selectedPost.content}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-slate-500 font-black uppercase text-[9px] md:text-[10px] ml-4 flex items-center gap-2">
                    <MessageSquare size={14} /> {selectedPost.replies?.length || 0} Réponses
                  </h3>
                  
                  {selectedPost.replies?.map((reply: any, index: number) => (
                    <motion.div key={index} className="p-6 md:p-8 bg-[#0d1424]/50 border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem]">
                      <div className="flex justify-between items-center mb-3 font-black text-[8px] md:text-[9px] uppercase tracking-widest">
                        <span className="text-cyan-400">@{reply.author}</span>
                        <span className="text-slate-600">{reply.date}</span>
                      </div>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{reply.text}</p>
                    </motion.div>
                  )) || <p className="text-center py-10 opacity-30 text-[10px] uppercase font-black">Aucune réponse...</p>}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-[#0d1424] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-2xl lg:sticky lg:top-24">
                  <h4 className="text-cyan-400 font-black uppercase text-[10px] tracking-widest mb-6 italic">Répondre</h4>
                  <input type="text" placeholder="PSEUDO" className="w-full bg-[#060a13] border border-white/5 p-4 rounded-xl outline-none font-black uppercase text-[10px] mb-4 focus:border-cyan-400 transition-all" value={replyForm.author} onChange={(e)=>setReplyForm({...replyForm, author: e.target.value})} />
                  <textarea value={replyForm.text} onChange={(e)=>setReplyForm({...replyForm, text: e.target.value})} placeholder="VOTRE MESSAGE..." className="w-full bg-[#060a13] border border-white/5 p-5 rounded-xl md:rounded-2xl outline-none text-[11px] min-h-[120px] focus:border-cyan-400 transition-all mb-4 md:mb-6" />
                  <button disabled={isSubmitting} onClick={handleReply} className="w-full bg-white text-[#0a0f1a] py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-cyan-400 transition-all">
                    {isSubmitting ? "ENVOI..." : "PUBLIER"}
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
