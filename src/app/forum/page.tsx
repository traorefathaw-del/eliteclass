"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, ArrowLeft, Send, X, Inbox, Loader2, User } from "lucide-react";
import { createClient } from "../../utils/supabase"; 

export default function ForumEliteFinal() {
  const supabase = createClient();

  const [view, setView] = useState<"list" | "read" | "ask">("list");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handlePostQuestion = async () => {
    if (!newQuestion.title || !newQuestion.content || !newQuestion.author) return;
    setIsSubmitting(true);
    const { error } = await supabase.from("discussions").insert([{
      title: newQuestion.title.toUpperCase(),
      content: newQuestion.content,
      author: newQuestion.author,
      tags: newQuestion.tags ? newQuestion.tags.split(",").map(t => t.trim().toUpperCase()) : ["GÉNÉRAL"],
      replies: []
    }]);
    if (!error) {
      await fetchDiscussions();
      setView("list");
      setNewQuestion({ title: "", content: "", tags: "", author: "" });
    }
    setIsSubmitting(false);
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
          
          {/* VUE LISTE */}
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
                  {discussions.map((post) => (
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
                </div>
              )}
            </motion.div>
          )}

          {/* VUE CRÉER (ASK) */}
          {view === "ask" && (
            <motion.div key="ask" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-4">
              <div className="flex justify-between items-center mb-10 text-4xl font-black italic uppercase">
                <h2>Nouveau <span className="text-[#22d3ee]">Ticket</span></h2>
                <button onClick={() => setView("list")} className="text-slate-700 hover:text-white transition-colors"><X size={32}/></button>
              </div>
              <input type="text" placeholder="VOTRE PSEUDO" className="w-full bg-slate-900 border border-white/5 p-5 rounded-2xl outline-none focus:border-[#22d3ee] font-black uppercase text-xs transition-all" onChange={(e)=>setNewQuestion({...newQuestion, author: e.target.value})} />
              <input type="text" placeholder="TITRE DE LA QUESTION" className="w-full bg-slate-900 border border-white/5 p-6 rounded-2xl outline-none focus:border-[#22d3ee] font-black italic uppercase text-lg transition-all" onChange={(e)=>setNewQuestion({...newQuestion, title: e.target.value})} />
              <textarea placeholder="DÉTAILLEZ VOTRE PROBLÈME..." className="w-full bg-slate-900 border border-white/5 p-8 rounded-[2rem] outline-none min-h-[200px] focus:border-[#22d3ee] text-sm transition-all" onChange={(e)=>setNewQuestion({...newQuestion, content: e.target.value})} />
              <button disabled={isSubmitting} onClick={handlePostQuestion} className="w-full bg-[#22d3ee] text-[#0a0f1a] p-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all">
                {isSubmitting ? "ENVOI EN COURS..." : "PUBLIER LA QUESTION"}
              </button>
            </motion.div>
          )}

          {/* VUE LECTURE (READ) */}
          {view === "read" && (
            <motion.div key="read" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 font-black uppercase text-[10px] hover:text-white transition-colors"><ArrowLeft size={16} /> Retour à la liste</button>
              
              {/* Question Principale */}
              <div className="p-10 bg-slate-900/30 border border-white/5 rounded-[3.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-[#22d3ee]/10"><MessageSquare size={120} /></div>
                <div className="flex items-center gap-3 text-[#22d3ee] font-black text-[10px] uppercase mb-4">
                  <User size={14} /> @{selectedPost.author}
                </div>
                <h2 className="text-5xl font-black italic uppercase mb-6 leading-none relative z-10 tracking-tighter">{selectedPost.title}</h2>
                <p className="text-slate-300 text-lg leading-relaxed relative z-10">{selectedPost.content}</p>
              </div>

              {/* LISTE DES RÉPONSES */}
              <div className="space-y-4">
                <h3 className="text-slate-500 font-black uppercase text-[10px] tracking-widest ml-4">
                  {selectedPost.replies?.length || 0} Réponses trouvées
                </h3>
                
                {selectedPost.replies && selectedPost.replies.length > 0 ? (
                  selectedPost.replies.map((reply: any, index: number) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: index * 0.1 }}
                      key={index} 
                      className="p-8 bg-slate-900/10 border border-white/5 rounded-[2.5rem]"
                    >
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

              {/* Formulaire de Réponse */}
              <div className="mt-12 bg-[#111827] border border-white/5 rounded-[3rem] p-4 shadow-2xl">
                <input 
                  type="text" 
                  placeholder="VOTRE PSEUDO..." 
                  className="bg-transparent px-8 py-4 w-full outline-none font-black uppercase text-[10px] border-b border-white/5 mb-2 focus:text-[#22d3ee] transition-colors" 
                  value={replyForm.author} 
                  onChange={(e)=>setReplyForm({...replyForm, author: e.target.value})} 
                />
                <textarea 
                  value={replyForm.text} 
                  onChange={(e)=>setReplyForm({...replyForm, text: e.target.value})} 
                  placeholder="ÉCRIVEZ VOTRE RÉPONSE ICI..." 
                  className="w-full bg-transparent p-8 outline-none text-sm min-h-[150px] focus:text-slate-200 transition-colors" 
                />
                <div className="flex justify-end p-4">
                  <button 
                    disabled={isSubmitting} 
                    onClick={handleReply} 
                    className="bg-[#22d3ee] text-[#0a0f1a] px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
                  >
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
