"use client";
import { useState } from "react";
import { FileText, Download, Search, Book, Code, Terminal, ExternalLink } from "lucide-react";
import Link from "next/link";

const DOCUMENTS = [
  { id: 1, title: "Guide de Survie Bash", type: "PDF", size: "1.2 MB", category: "Système", icon: <Terminal className="text-blue-400" /> },
  { id: 2, title: "Next.js 16 Mastery", type: "DOCX", size: "4.5 MB", category: "Frontend", icon: <Code className="text-emerald-400" /> },
  { id: 3, title: "Architecture Linux", type: "PDF", size: "890 KB", category: "Système", icon: <Book className="text-orange-400" /> },
  { id: 4, title: "Algorithmique Avancée", type: "PDF", size: "2.1 MB", category: "Théorie", icon: <FileText className="text-purple-400" /> },
];

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocs = DOCUMENTS.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        
        {/* EN-TÊTE */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4">
              Archives <span className="text-blue-600 not-italic uppercase font-sans">Elite</span>
            </h1>
            <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
              // Répertoire central des connaissances partagées
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un document..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-all font-medium text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* GRILLE DE DOCUMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div 
              key={doc.id}
              className="group bg-slate-900/30 border border-white/5 p-6 rounded-[2rem] hover:bg-blue-600/5 hover:border-blue-500/30 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
                  {doc.icon}
                </div>
                <span className="text-[10px] font-black px-3 py-1 bg-white/5 rounded-full text-slate-400 uppercase tracking-tighter">
                  {doc.type}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight italic">
                {doc.title}
              </h3>
              
              <div className="flex items-center gap-4 text-[10px] font-mono text-slate-600 mb-8 uppercase">
                <span>{doc.category}</span>
                <span className="w-1 h-1 bg-slate-800 rounded-full" />
                <span>{doc.size}</span>
              </div>

              <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all active:scale-95">
                <Download size={16} /> Télécharger la ressource
              </button>
            </div>
          ))}
        </div>

        {/* SECTION LIENS EXTERNES */}
        <div className="mt-24 p-12 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-black italic uppercase mb-2">Besoin d'aller plus loin ?</h2>
            <p className="text-slate-400 text-sm">Consultez la documentation officielle d'Ubuntu.</p>
          </div>
          <a href="https://ubuntu.com/tutorials" target="_blank" className="flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:text-blue-500 transition-colors">
            Documentation Officielle <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
