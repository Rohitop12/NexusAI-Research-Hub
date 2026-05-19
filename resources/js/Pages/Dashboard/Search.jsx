import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Mic, Filter, BookOpen, MessageSquare, Download, Bookmark, Sparkles, TrendingUp, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { addActivity } from '@/utils/activity';

import DashboardLayout from '@/Layouts/DashboardLayout';

const mockResults = [
  {
    id: 1,
    title: "Advancements in LLM Fine-Tuning for Medical Diagnostics",
    summary: "This paper explores novel parameter-efficient fine-tuning (PEFT) methods on 7B parameter models for identifying rare respiratory diseases with 94% accuracy.",
    department: "Healthcare AI",
    domain: "Natural Language Processing",
    innovationScore: 92,
    similarity: 88,
    authors: ["Dr. Sarah Chen", "James Wilson"],
    date: "Mar 15, 2026",
    tags: ["LLM", "PEFT", "Medical"]
  },
  {
    id: 2,
    title: "Thermal Stability Analysis of Solid-State Lithium Batteries",
    summary: "Comprehensive testing of ceramic electrolytes showing improved thermal runaway thresholds up to 350°C under extreme stress conditions.",
    department: "Energy Storage",
    domain: "Materials Science",
    innovationScore: 85,
    similarity: 76,
    authors: ["Dr. A. Patel", "Team Delta"],
    date: "Feb 02, 2026",
    tags: ["Solid-State", "Thermal", "Lithium"]
  }
];

export default function Search() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(mockResults);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Auto-run search if ?q= is in the URL (from Recent Activity click)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q && q.trim()) {
      setQuery(q);
      runSearch(q);
    }
  }, []);

  const runSearch = async (searchQuery) => {
    setIsSearching(true);
    try {
      const response = await axios.post('/api/search', { query: searchQuery, limit: 10 });
      setResults(response.data.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await axios.post('/api/search', {
        query: query,
        limit: 10
      });
      setResults(response.data.results);
      // Log to recent activity
      addActivity({
        title: query,
        type: 'Search',
        meta: `${response.data.results?.length ?? 0} results`,
        href: `/dashboard/search?q=${encodeURIComponent(query)}`,
      });
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto w-full pb-20">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 text-ui-heading">Semantic <span className="text-black/20">AI</span> Search</h1>
        <p className="text-ui-muted">Search naturally across millions of R&D documents using semantic understanding.</p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto mb-12">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-ui-muted" />
        </div>
        <input
          type="text"
          className="w-full bg-white border border-ui-border rounded-2xl py-4 pl-12 pr-24 text-lg text-ui-heading placeholder-ui-muted focus:outline-none focus:border-ui-black focus:ring-1 focus:ring-ui-black transition-all shadow-sm"
          placeholder='Try "Show AI healthcare projects from 2026 involving NLP"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 right-3 flex items-center gap-2">
          <button type="button" className="p-2 hover:bg-bg-main rounded-xl text-ui-muted hover:text-ui-black transition-colors" title="Voice Search">
            <Mic className="h-5 w-5" />
          </button>
          <button type="submit" className="bg-ui-black hover:bg-gray-900 text-white px-4 py-1.5 rounded-xl font-medium transition-colors">
            Search
          </button>
        </div>
      </form>

      {/* AI Overview if available */}
      {results.length > 0 && results[0].ai_overview && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto mb-10 bg-bg-main border border-ui-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-ui-muted" />
            <span className="text-xs font-bold uppercase tracking-wider text-ui-muted">R&D AI Insight</span>
          </div>
          <p className="text-sm text-ui-heading leading-relaxed italic">"{results[0].ai_overview}"</p>
        </motion.div>
      )}

      {isSearching ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Sparkles className="w-8 h-8 text-black/20 animate-pulse mb-4" />
          <p className="text-ui-muted animate-pulse">Running semantic analysis...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-ui-heading">Found {results.length} highly relevant results</h2>
            <button className="flex items-center gap-2 text-sm text-ui-muted hover:text-ui-black"><Filter className="w-4 h-4"/> Filters</button>
          </div>

          {results.map((result) => (
            <motion.div 
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-ui-border rounded-2xl p-6 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded bg-bg-main text-xs font-medium text-ui-muted">{result.department}</span>
                    <span className="px-2.5 py-1 rounded border text-xs font-medium bg-ui-border/50 border-ui-border text-ui-muted">
                      {result.isExternal ? 'OpenAlex' : result.domain}
                    </span>
                    {result.citationCount !== undefined && (
                      <span className="px-2.5 py-1 rounded bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-600">{result.citationCount} Citations</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-ui-heading group-hover:text-ui-muted transition-colors cursor-pointer">{result.title}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold text-ui-black">{result.innovationScore}</div>
                  <div className="text-[10px] uppercase tracking-wider text-ui-muted font-bold">Innovation Score</div>
                </div>
              </div>

              <div className="bg-bg-main border border-ui-border rounded-xl p-4 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-ui-muted" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ui-muted">
                    {result.isExternal ? 'Paper Abstract' : 'AI Summary'}
                  </span>
                </div>
                <p className="text-sm text-ui-heading leading-relaxed opacity-80 line-clamp-3">{result.summary}</p>
              </div>

              <div className="flex justify-between items-center mt-4 border-t border-ui-divider pt-4">
                <div className="flex items-center gap-4 text-sm text-ui-muted">
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4"/> {result.authors ? result.authors.join(', ') : 'Unknown Author'}</span>
                  <span>•</span>
                  <span>{result.date}</span>
                  {result.source && (
                    <>
                      <span>•</span>
                      <span className="text-xs border border-ui-border px-2 py-0.5 rounded">{result.source}</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="p-2 text-ui-muted hover:text-ui-black hover:bg-bg-main rounded-lg transition-colors" title="Bookmark">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  {result.pdfUrl && (
                    <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-ui-muted hover:text-ui-black hover:bg-bg-main rounded-lg transition-colors" title="Download PDF">
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  {!result.isExternal && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-bg-main hover:bg-ui-border border border-ui-border rounded-lg text-sm font-medium transition-colors text-ui-heading">
                      <MessageSquare className="w-4 h-4" /> Chat with Document
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedDocument(result)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-ui-black text-white hover:bg-gray-800"
                  >
                    <BookOpen className="w-4 h-4" /> {result.isExternal ? 'View Paper' : 'View Research'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>

    {/* Document Viewer Modal */}
    <AnimatePresence>
      {selectedDocument && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedDocument(null)}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#08080A] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-start p-6 border-b border-white/5 bg-[#121215]">
              <div>
                <div className="flex gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded bg-[#1A1A20] text-xs font-medium text-slate-300">{selectedDocument.department}</span>
                  <span className="px-2.5 py-1 rounded bg-white/10 border border-white/10 text-xs font-medium text-slate-300">{selectedDocument.domain}</span>
                </div>
                <h2 className="text-2xl font-bold text-white pr-8">{selectedDocument.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedDocument(null)}
                className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              <div className="flex justify-between items-center bg-[#15151A] p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" /> 
                    {selectedDocument.authors ? selectedDocument.authors.join(', ') : 'Unknown Author'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    {selectedDocument.date}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-accent-yellow font-bold text-lg">
                  <Sparkles className="w-5 h-5" /> {selectedDocument.innovationScore} Score
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-slate-400" /> AI Executive Summary
                </h3>
                <div className="bg-white/5 border border-white/5 rounded-xl p-5 text-slate-300 leading-relaxed text-sm">
                  {selectedDocument.summary}
                  <p className="mt-3 text-slate-400">This document was matched because its embeddings closely align with your search semantics. It contains highly relevant methodologies regarding {selectedDocument.domain.toLowerCase()}.</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Extracted Content Preview</h3>
                <div className="bg-[#121215] border border-white/5 rounded-xl p-5">
                  <div className="h-40 bg-gradient-to-b from-slate-400/20 to-transparent rounded animate-pulse mb-3"></div>
                  <p className="text-center text-sm text-slate-500">Full document text is securely stored and requires specific access permissions to view in its entirety.</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-ui-border bg-bg-main flex justify-between items-center">
              <div className="flex items-center gap-3 text-sm text-ui-muted">
                <Bookmark className="w-4 h-4" /> Save to research space
              </div>
              <div className="flex gap-3">
                {selectedDocument.pdfUrl && (
                  <a href={selectedDocument.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-ui-black text-white rounded-lg text-sm font-medium transition-colors">
                    <Download className="w-4 h-4" /> Open Full PDF
                  </a>
                )}
                {selectedDocument.doi && (
                  <a href={`https://doi.org/${selectedDocument.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                    <BookOpen className="w-4 h-4" /> View via DOI
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    </DashboardLayout>
  );
}
