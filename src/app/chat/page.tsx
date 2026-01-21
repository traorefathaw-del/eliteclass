"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, Loader2, User, ImageIcon, ArrowLeft, MessageCircle } from "lucide-react";
import { createClient } from "../../utils/supabase"; 

export default function PrivateChat() {
  const supabase = createClient();

  const [messages, setMessages] = useState<any[]>([]);
  const [recentChats, setRecentChats] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [myUsername, setMyUsername] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [inConversation, setInConversation] = useState(false);

  const [messageText, setMessageText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Charger les contacts avec qui j'ai déjà discuté
  const fetchRecentChats = async () => {
    if (!myUsername.trim()) return;
    const { data, error } = await supabase
      .from("private_messages") // Nom de ta table vérifié sur la photo
      .select("sender, receiver")
      .or(`sender.eq."${myUsername}",receiver.eq."${myUsername}"`);

    if (!error && data) {
      const contacts = new Set<string>();
      data.forEach((msg: any) => {
        if (msg.sender !== myUsername) contacts.add(msg.sender);
        if (msg.receiver !== myUsername) contacts.add(msg.receiver);
      });
      setRecentChats(Array.from(contacts));
    }
  };

  useEffect(() => {
    if (myUsername) fetchRecentChats();
  }, [myUsername, inConversation]);

  // Charger les messages de la conversation
  const fetchMessages = async () => {
    if (!myUsername || !targetUser) return;
    const { data, error } = await supabase
      .from("private_messages")
      .select("*")
      .or(`and(sender.eq."${myUsername}",receiver.eq."${targetUser}"),and(sender.eq."${targetUser}",receiver.eq."${myUsername}")`)
      .order("created_at", { ascending: true });

    if (!error && data) setMessages(data);
  };

  useEffect(() => {
    let interval: any;
    if (inConversation) {
      fetchMessages();
      interval = setInterval(fetchMessages, 3000); // Refresh auto
    }
    return () => clearInterval(interval);
  }, [inConversation, targetUser]);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { error } = await supabase.storage.from('forum-images').upload(fileName, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('forum-images').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !imageFile) || !myUsername || !targetUser) return;
    setIsSubmitting(true);
    
    try {
      let imageUrl = null;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      // Envoi vers ta table private_messages
      const { error } = await supabase.from("private_messages").insert([{
        sender: myUsername.trim(),
        receiver: targetUser.trim(),
        content: messageText,
        image_url: imageUrl
      }]);

      if (error) throw error;

      setMessageText("");
      setImageFile(null);
      fetchMessages();
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur d'envoi. Vérifie que les colonnes sender, receiver et content existent bien.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6 pt-24 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {!inConversation ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <h1 className="text-5xl font-black italic uppercase text-center tracking-tighter">Elite<span className="text-[#22d3ee]">.</span>Chat</h1>
            
            <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 space-y-4 shadow-2xl">
              <input 
                type="text" 
                placeholder="TON PSEUDO" 
                className="w-full bg-slate-900 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#22d3ee] font-black uppercase text-xs"
                value={myUsername}
                onChange={(e) => setMyUsername(e.target.value)}
              />
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="RECHERCHER UN UTILISATEUR..." 
                  className="w-full bg-slate-900 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#22d3ee] font-black uppercase text-xs pl-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              </div>
              <button 
                onClick={() => { if(myUsername && searchQuery) { setTargetUser(searchQuery); setInConversation(true); }}}
                className="w-full bg-[#22d3ee] text-[#0a0f1a] p-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all"
              >
                DÉMARRER LA DISCUSSION
              </button>
            </div>

            {/* LISTE DES DISCUSSIONS RÉCENTES */}
            {myUsername && recentChats.length > 0 && (
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Discussions Récentes</p>
                <div className="grid gap-3">
                  {recentChats.map((user) => (
                    <button 
                      key={user}
                      onClick={() => { setTargetUser(user); setInConversation(true); }}
                      className="flex items-center gap-4 p-5 bg-slate-900/30 border border-white/5 rounded-2xl hover:border-[#22d3ee]/50 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[#22d3ee] font-black">
                        {user[0].toUpperCase()}
                      </div>
                      <span className="flex-1 text-left font-black italic uppercase text-sm group-hover:text-[#22d3ee]">@{user}</span>
                      <MessageCircle size={18} className="text-slate-600 group-hover:text-[#22d3ee]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[80vh]">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setInConversation(false)} className="text-slate-500 hover:text-white transition-colors"><ArrowLeft /></button>
              <h2 className="text-xl font-black italic uppercase text-[#22d3ee]">@{targetUser}</h2>
              <div className="w-8"></div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === myUsername ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl ${msg.sender === myUsername ? "bg-[#22d3ee] text-[#0a0f1a]" : "bg-slate-900 border border-white/10 text-white"}`}>
                    {msg.image_url && <img src={msg.image_url} className="rounded-xl mb-2 max-h-48 w-full object-cover shadow-lg" />}
                    <p className="text-sm font-bold">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-3 shadow-2xl flex items-center gap-3">
               <label className="cursor-pointer p-3 text-slate-500 hover:text-[#22d3ee] transition-colors relative">
                  <ImageIcon size={20} />
                  {imageFile && <div className="absolute top-2 right-2 w-2 h-2 bg-[#22d3ee] rounded-full"></div>}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
               </label>
               <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Tapez votre message..." 
                  className="flex-1 bg-transparent outline-none text-xs font-bold"
               />
               <button onClick={handleSendMessage} disabled={isSubmitting} className="bg-[#22d3ee] p-4 rounded-2xl text-[#0a0f1a] hover:brightness-110 active:scale-95 transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
               </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
