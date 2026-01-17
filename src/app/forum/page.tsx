"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ThumbsUp, Search, Plus, ArrowLeft, Send, X, Inbox } from "lucide-react";

export default function ForumPage() {
  const [view, setView] = useState<"list" | "read" | "ask">("list");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  
  // INITIALISATION À VIDE
  const [discussions, setDiscussions] = useState<any[]>([]);

  // États pour les formulaires
  const [newQuestion, setNewQuestion] = useState({ title: "", content: "", tags: "" });
  const [replyText, setReplyText] = useState("");

  // Fonction pour publier une question
  const handlePostQuestion = () => {
    if (!newQuestion.title || !newQuestion.content) return;

    const post = {
      id: Date.now(),
      title: newQuestion.title,
      content: newQuestion.content,
      author: "Fathaw", // Ici on pourra dynamiser avec Supabase
      replies: [],
      likes: 0,
      tags: newQuestion.tags ? newQuestion.tags.split(",") : ["Général"],
      createdAt: new Date().toLocaleDateString()
    };

    setDiscussions([post, ...discussions]);
    setView("list");
    setNewQuestion({ title: "", content: "", tags: "" });
  };

  // Fonction pour répondre
  const handleReply = () => {
    if (!replyText.trim()) return;
    
    const updatedPost = { ...selectedPost };
    updatedPost.replies.push({ 
        author: "Ami Elite", 
        text: replyText,
        date: "À l'instant"
    });
    
    setSelectedPost(updatedPost);
    setReplyText("");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pt-24 selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto">
        
        <AnimatePresence mode="wait">
          {/* --- VUE LISTE VIDE --- */}
          {view === "list" && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h1 className="text-5xl font-black italic tracking-tighter uppercase">Le <span className="text-blue-500">Forum</span></h1>
                  <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] mt-2 font-black italic">// 0 Discussion active</p>
                </div>
                <button 
                  onClick={() => setView("ask")}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/10 active:scale-95"
                >
                  <Plus size={16} className="inline mr-2" /> Poser une question
                </button>
              </div>

              {discussions.length === 0 ? (
                <div className="py-20 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-700">
                    <Inbox size={32} />
                  </div>
                  <h3 className="text-xl font-black italic uppercase text-slate-400">Le vide absolu</h3>
                  <p className="text-slate-600 text-xs mt-2 max-w-xs uppercase tracking-widest font-bold">Soyez le premier à briser le silence et à partager votre savoir.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {discussions.map((post) => (
                    <motion.div 
                      layoutId={`post-${post.id}`}
                      key={post.id}
                      onClick={() => { setSelectedPost(post); setView("read"); }}
                      className="p-8 bg-slate-900/20 border border-white/5 rounded-[2.5rem] cursor-pointer hover:bg-white/[0.02] transition-all group"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex gap-2 mb-3">
                            {post.tags.map((tag: string) => (
                              <span key={tag} className="text-[8px] font-black uppercase bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md">{tag}</span>
                            ))}
                          </div>
                          <h3 className="text-2xl font-bold group-hover:text-blue-400 transition-colors italic uppercase tracking-tight">{post.title}</h3>
                          <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-widest">Par @{post.author} • {post.replies.length} réponse(s)</p>
                        </div>
                        <div className="text-slate-700 group-hover:text-blue-500 transition-colors">
                            <MessageSquare size={24} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* --- VUE POSER UNE QUESTION --- */}
          {view === "ask" && (
            <motion.div key="ask" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-8">
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Ouvrir un <span className="text-blue-500">Ticket</span></h2>
                <button onClick={() => setView("list")} className="p-2 hover:bg-white/5 rounded-full"><X size={24}/></button>
              </div>
              
              <div className="space-y-4">
                <input 
                  type="text" placeholder="TITRE DE LA PROBLÉMATIQUE"
                  className="w-full bg-slate-950 border border-white/10 p-6 rounded-2xl outline-none focus:border-blue-500 font-black italic transition-all"
                  onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                />
                <input 
                  type="text" placeholder="TAGS (EX: REACT, SUPABASE)"
                  className="w-full bg-slate-950 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 text-[10px] font-black uppercase tracking-widest"
                  onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})}
                />
                <textarea 
                  placeholder="DÉTAILLEZ VOTRE ANALYSE..."
                  className="w-full bg-slate-950 border border-white/10 p-6 rounded-2xl outline-none min-h-[250px] focus:border-blue-500 font-medium text-sm transition-all"
                  onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                />
                <button 
                  onClick={handlePostQuestion}
                  className="w-full bg-blue-600 hover:bg-blue-500 p-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[12px] shadow-2xl shadow-blue-600/20 transition-all"
                >
                  Déployer la question
                </button>
              </div>
            </motion.div>
          )}

          {/* --- VUE LECTURE & RÉPONSE --- */}
          {view === "read" && (
            <motion.div key="read" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]">
                <ArrowLeft size={16} /> Fermer le ticket
              </button>

              <div className="p-10 bg-slate-900/40 border border-white/5 rounded-[3rem]">
                <h2 className="text-4xl font-black italic mb-6 uppercase tracking-tighter">{selectedPost.title}</h2>
                <div className="flex items-center gap-4 mb-8 text-[10px] font-black uppercase text-blue-500 tracking-widest">
                    <span>@{selectedPost.author}</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-slate-500">{selectedPost.createdAt}</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-lg font-medium">{selectedPost.content}</p>
              </div>

              <div className="space-y-6 ml-12">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">// Solutions proposées</h3>
                {selectedPost.replies.length === 0 && <p className="text-slate-700 text-xs italic">Aucune solution pour le moment...</p>}
                {selectedPost.replies.map((r: any, i: number) => (
                  <div key={i} className="bg-slate-950 p-6 rounded-[2rem] border border-white/5">
                    <p className="text-blue-500 font-black text-[10px] uppercase tracking-widest mb-2">@{r.author}</p>
                    <p className="text-slate-300 text-sm">{r.text}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900/60 p-2 rounded-[2.5rem] border border-white/5 mt-12 focus-within:border-blue-500/30 transition-all">
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="VOTRE APPORT TECHNIQUE..."
                  className="w-full bg-transparent p-6 outline-none text-sm min-h-[120px] font-medium"
                />
                <div className="flex justify-end p-4">
                  <button onClick={handleReply} className="bg-white text-black hover:bg-blue-600 hover:text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Publier la solution
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
