"use client";
import { useState, useEffect, useRef } from "react";
import { 
  Search, Youtube, Play, ExternalLink, 
  Flame, Clock, Maximize2, Minimize2, 
  Trash2, Trophy 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Note: Pense à utiliser une variable d'environnement pour la clé API en production
const YOUTUBE_API_KEY = "AIzaSyAIk3hiGqaNKbW7YI0gmYXOaamt0oozacA";

export default function YouTubePremiumStudio() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [history, setHistory] = useState([]);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const searchRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("yt_history");
    if (saved) setHistory(JSON.parse(saved));

    // CORRECTION : Ajout du type MouseEvent pour l'argument 'event'
    const handleClickOutside = (event: MouseEvent) => {
      // Ajout de 'as Node' pour que TypeScript comprenne que l'élément est une partie du DOM
      if (searchRef.current && !(searchRef.current as any).contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchYouTube = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    setIsSearchFocused(false);
    
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(searchQuery)}&type=video&key=${YOUTUBE_API_KEY}`
      );
      const data = await res.json();
      if (data.items) {
        const formatted = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.high.url,
        }));
        setVideos(formatted);
        if (!activeVideo && formatted.length > 0) setActiveVideo(formatted[0]);

        const newHistory = [searchQuery, ...history.filter(h => h !== searchQuery)].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem("yt_history", JSON.stringify(newHistory));
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-200 font-sans">
      
      {/* HEADER DE RECHERCHE */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-6 flex items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
                <Youtube size={18} className="text-white" fill="white" />
            </div>
            <h1 className="hidden md:block text-lg font-black uppercase tracking-tighter text-white">YOUB-ELITE</h1>
        </div>

        <div ref={searchRef} className="flex-1 max-w-xl relative">
          <div className="relative z-[70]">
            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-red-500' : 'text-slate-500'}`} size={16} />
            <input 
              type="text"
              placeholder="Rechercher une vidéo..."
              className="w-full bg-[#0a0f1a] border border-white/10 rounded-2xl py-3 md:py-3.5 pl-12 pr-6 text-xs focus:border-red-600/50 outline-none transition-all focus:ring-4 focus:ring-red-600/5"
              value={query}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchYouTube()}
            />
          </div>
          
          <AnimatePresence>
            {isSearchFocused && history.length > 0 && query === "" && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 w-full mt-2 bg-[#0d1117] border border-white/10 rounded-2xl p-2 shadow-2xl z-[60] backdrop-blur-xl"
              >
                <div className="flex justify-between items-center px-3 py-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Récents</span>
                  <button onClick={() => { setHistory([]); localStorage.removeItem("yt_history"); }} className="text-slate-600 hover:text-red-500"><Trash2 size={12} /></button>
                </div>
                {history.map((h, i) => (
                  <button key={i} onClick={() => { setQuery(h); searchYouTube(h); }} className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl text-[11px] font-bold flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                    <Clock size={12} /> {h}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={() => setIsCinemaMode(!isCinemaMode)} className={`p-3 rounded-xl transition-all ${isCinemaMode ? 'bg-red-600 text-white' : 'bg-white/5 text-slate-400 border border-white/5'}`}>
          {isCinemaMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      <main className={`p-4 md:p-8 mx-auto flex flex-col lg:flex-row gap-8 transition-all duration-500 ${isCinemaMode ? 'max-w-full' : 'max-w-[1600px]'}`}>
        
        {/* LECTEUR PRINCIPAL */}
        <div className="flex-1">
          {activeVideo ? (
            <div className="space-y-6">
              <div className={`w-full rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 bg-black transition-all duration-500 ${isCinemaMode ? 'aspect-[21/9]' : 'aspect-video'}`}>
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${(activeVideo as any).id}?autoplay=1`} allowFullScreen />
              </div>
              <div className="flex justify-between items-start px-2">
                <div className="max-w-[80%]">
                  <h2 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug" dangerouslySetInnerHTML={{__html: (activeVideo as any).title}} />
                  <span className="inline-block px-3 py-1 bg-white/5 text-slate-400 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest">{(activeVideo as any).channel}</span>
                </div>
                <a href={`https://youtube.com/watch?v=${(activeVideo as any).id}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-all"><ExternalLink size={18} /></a>
              </div>
            </div>
          ) : (
            <div className="aspect-video w-full rounded-[2rem] border-2 border-dashed border-white/5 bg-white/[0.02] flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Play size={32} className="text-slate-700 translate-x-1" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 text-center max-w-xs">
                Lancez une recherche pour afficher le contenu multimédia
              </p>
            </div>
          )}
        </div>

        {/* SECTION SUGGESTIONS */}
        {!isCinemaMode && (
          <div className="w-full lg:w-[380px] space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                    <Flame size={12} className="text-red-500" /> Vidéos suggérées
                </h3>
            </div>
            <div className="space-y-3 lg:h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
              {videos.length > 0 ? (
                videos.map((video: any) => (
                    <div 
                      key={video.id} 
                      onClick={() => { setActiveVideo(video); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`group flex gap-4 p-3 rounded-2xl cursor-pointer transition-all border border-transparent ${(activeVideo as any)?.id === video.id ? 'bg-red-600/5 border-red-600/20' : 'hover:bg-white/5'}`}
                    >
                      <div className="relative w-32 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-lg border border-white/5">
                        <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      </div>
                      <div className="flex flex-col justify-center overflow-hidden">
                        <h4 className="text-[11px] font-bold text-slate-200 line-clamp-2 leading-tight" dangerouslySetInnerHTML={{__html: video.title}} />
                        <p className="text-[9px] text-slate-500 mt-2 font-black uppercase tracking-tighter truncate opacity-60">{video.channel}</p>
                      </div>
                    </div>
                ))
              ) : (
                <div className="py-20 text-center opacity-20">
                    <Trophy size={40} className="mx-auto mb-2" />
                    <p className="text-[8px] font-black uppercase tracking-widest">Aucun résultat</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,0,0,0.2); }
      `}</style>
    </div>
  );
}
