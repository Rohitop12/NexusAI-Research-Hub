import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BrainCircuit, ChevronRight, FileText, Share2, Fingerprint, BarChart3, Network, Database,} from 'lucide-react';
import { Link } from '@inertiajs/react';

function Landing({ auth }) {
  const [activeTab, setActiveTab] = useState('search_chat');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-sans bg-bg-main relative selection:bg-accent-blue/30 text-ui-heading">
      {/* Navbar matching reference */}
      <nav className={`fixed top-0 w-full z-50 px-8 flex justify-between items-center transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-white/75 backdrop-blur-md border-b border-ui-border/60 shadow-sm' 
          : 'pt-4 pb-2 bg-transparent'
      }`}>
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-ui-black w-6 h-6" />
          <span className="text-lg font-medium tracking-wide text-ui-black">Nexus<span className="opacity-80">AI</span></span>
        </div>

        <div className="hidden md:flex items-center bg-black backdrop-blur-md rounded-full px-2 py-1.5 border border-ui-border/10 text-sm font-medium">
          <a href="#services" className="px-5 py-2 hover:bg-white/20 rounded-full transition-colors text-white">Nexus R&D</a>
          <a href="#features" className="px-5 py-2 hover:bg-white/20 rounded-full transition-colors text-white flex items-center gap-1">Features <ChevronRight className="w-3 h-3 rotate-90" /></a>
          <a href="#team" className="px-5 py-2 hover:bg-white/20 rounded-full transition-colors text-white">Team</a>
        </div>

        <div className="flex items-center gap-4">
          {auth?.user ? (
            <Link
              href={route('dashboard')}
              className="bg-accent-blue text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-accent-blue/20"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href={route('login')}
                className="text-sm font-medium text-black hover:text-black/50 transition-colors px-4"
              >
                Log in
              </Link>
              <Link
                href={route('register')}
                className="bg-ui-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-900 transition-colors shadow-lg"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-20 px-6 text-center relative z-10 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.2] mb-6 max-w-4xl mx-auto"
        >
          Transforming R&D Knowledge, <br />
          Our <span className="text-accent-yellow relative inline-block">Expertise
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 0" stroke="#FFD600" strokeWidth="2" fill="none" />
            </svg>
          </span> <br />
          — Let's Innovate Together
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[15px] text-ui-muted max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Turn your research data into a thriving knowledge engine. With our hands-on support in AI, semantic search, and document intelligence, we'll craft a platform that ensures your R&D is nothing short of remarkable. Ready to make it happen?
        </motion.p>

        <div className="flex items-center gap-4 mt-10">
          {auth?.user ? (
            <Link
              href={route('dashboard')}
              className="bg-ui-black text-white text-sm font-medium px-8 py-3.5 rounded-full flex items-center gap-2 transition-all shadow-lg hover:bg-gray-900"
            >
              Go to Dashboard <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href={route('register')}
              className="bg-ui-black text-white text-sm font-medium px-8 py-3.5 rounded-full flex items-center gap-2 transition-all shadow-lg hover:bg-gray-900"
            >
              Get Started <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-20 px-6 relative z-10">
        <p className="text-center text-xs font-semibold tracking-wider text-slate-500 mb-8">Trusted by <span className="text-accent-yellow">100+</span> companies</p>
        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {/* Logo placeholders */}
          {['optio', 'TOMO', 'DQ', 'Quantec', 'stellar'].map((name, i) => (
            <div key={i} className="bg-white border border-ui-border rounded-2xl h-24 w-48 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer shadow-sm">
              <span className="font-bold text-xl tracking-wider text-ui-heading flex items-center gap-2">
                {i === 0 && <span className="w-4 h-4 rounded-full bg-accent-blue inline-block"></span>}
                {i === 3 && <BrainCircuit className="w-5 h-5 text-accent-blue" />}
                {i === 4 && <Share2 className="w-5 h-5 text-accent-blue" />}
                {name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Why Section */}
      <section className="py-32 px-6 max-w-6xl mx-auto relative z-10" id="features">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Unrivaled R&D Capabilities</h2>
          <p className="text-slate-500 max-w-3xl mx-auto text-[15px] leading-relaxed">
            Explore the complete suite of intelligence tools designed to accelerate scientific breakthroughs. From ingestions to connections, we've built every module for researcher productivity.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16 border-b border-ui-border max-w-4xl mx-auto pb-4">
          <button
            onClick={() => setActiveTab('search_chat')}
            className={`px-6 py-3 text-sm font-semibold rounded-full transition-all duration-200 ${activeTab === 'search_chat' ? 'bg-ui-black text-white shadow-sm' : 'text-ui-muted hover:text-ui-black bg-white border border-ui-border'}`}
          >
            AI Search & Chat
          </button>
          <button
            onClick={() => setActiveTab('ingestion')}
            className={`px-6 py-3 text-sm font-semibold rounded-full transition-all duration-200 ${activeTab === 'ingestion' ? 'bg-ui-black text-white shadow-sm' : 'text-ui-muted hover:text-ui-black bg-white border border-ui-border'}`}
          >
            Ingestion Pipeline
          </button>
          <button
            onClick={() => setActiveTab('graphs')}
            className={`px-6 py-3 text-sm font-semibold rounded-full transition-all duration-200 ${activeTab === 'graphs' ? 'bg-ui-black text-white shadow-sm' : 'text-ui-muted hover:text-ui-black bg-white border border-ui-border'}`}
          >
            Knowledge Networks
          </button>
          <button
            onClick={() => setActiveTab('analytics_access')}
            className={`px-6 py-3 text-sm font-semibold rounded-full transition-all duration-200 ${activeTab === 'analytics_access' ? 'bg-ui-black text-white shadow-sm' : 'text-ui-muted hover:text-ui-black bg-white border border-ui-border'}`}
          >
            Analytics & Security
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="relative min-h-[460px]">
          <AnimatePresence mode="wait">
            {activeTab === 'search_chat' && (
              <motion.div
                key="search_chat"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-8 w-full"
              >
                {/* Hybrid Search */}
                <div className="bg-white rounded-3xl p-10 border border-ui-border group hover:border-ui-divider hover:shadow-md transition-all duration-350 flex flex-col justify-between shadow-sm min-h-[440px]">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-ui-black mb-6 border border-ui-border group-hover:bg-ui-black group-hover:text-white transition-all duration-300">
                      <Search className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AI-Powered Hybrid Search</h3>
                    <p className="text-sm text-ui-muted leading-relaxed mb-6">
                      Query internal documents and 200M+ academic articles dynamically using Semantic Scholar Academic Graph. Retrieve exact literature references in milliseconds.
                    </p>
                  </div>
                  <div className="bg-bg-main rounded-2xl p-4 border border-ui-border relative overflow-hidden flex flex-col gap-2">
                    <div className="flex gap-2 items-center bg-white border border-ui-border p-2 rounded-xl text-xs shadow-sm">
                      <span className="font-semibold text-accent-blue bg-blue-50 px-2 py-0.5 rounded">Hybrid</span>
                      <span className="text-ui-muted">Find solid-state battery synthesis...</span>
                    </div>
                    <div className="flex gap-2 items-center bg-white/50 p-2 rounded-xl text-[10px] text-ui-muted">
                      <span>✓ Found 14 internal, 329 external matches</span>
                    </div>
                  </div>
                </div>

                {/* AI Chatbot */}
                <div className="bg-white rounded-3xl p-10 border border-ui-border group hover:border-ui-divider hover:shadow-md transition-all duration-350 flex flex-col justify-between shadow-sm min-h-[440px]">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-ui-black mb-6 border border-ui-border group-hover:bg-ui-black group-hover:text-white transition-all duration-300">
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Context-Aware AI Chatbot</h3>
                    <p className="text-sm text-ui-muted leading-relaxed mb-6">
                      An intelligent copilot that chats directly with your research dataset. Ask complex cross-document questions and receive structured synthesis with page citations.
                    </p>
                  </div>
                  <div className="bg-bg-main rounded-2xl p-4 border border-ui-border relative overflow-hidden flex flex-col gap-2 h-24 justify-end">
                    <div className="bg-white border border-ui-border p-2.5 rounded-xl text-xs max-w-[85%] shadow-sm self-start">
                      Summarize the innovation score of PDF #4
                    </div>
                    <div className="bg-ui-black text-white p-2.5 rounded-xl text-[11px] max-w-[85%] shadow-sm self-end">
                      Based on synthesis, the novelty is high (8.9)...
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ingestion' && (
              <motion.div
                key="ingestion"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-8 w-full"
              >
                {/* Extraction */}
                <div className="bg-white rounded-3xl p-10 border border-ui-border group hover:border-ui-divider hover:shadow-md transition-all duration-350 flex flex-col justify-between shadow-sm min-h-[440px]">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-ui-black mb-6 border border-ui-border group-hover:bg-ui-black group-hover:text-white transition-all duration-300">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Automated PDF Parsing</h3>
                    <p className="text-sm text-ui-muted leading-relaxed mb-6">
                      Seamlessly upload PDFs. The platform performs instant text extraction, structural processing, and creates vector embeddings automatically in the background.
                    </p>
                  </div>
                  <div className="bg-bg-main rounded-2xl p-6 border border-ui-border flex flex-col gap-2 justify-center items-center h-28 relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-ui-border text-ui-muted group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5 text-accent-blue" />
                    </div>
                    <div className="text-[11px] font-semibold text-ui-black">polymer_synthesis_v2.pdf (4.8 MB)</div>
                    <div className="w-32 h-1.5 bg-ui-border rounded-full overflow-hidden">
                      <div className="h-full bg-accent-blue w-2/3 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Innovation Scoring */}
                <div className="bg-white rounded-3xl p-10 border border-ui-border group hover:border-ui-divider hover:shadow-md transition-all duration-350 flex flex-col justify-between shadow-sm min-h-[440px]">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-ui-black mb-6 border border-ui-border group-hover:bg-ui-black group-hover:text-white transition-all duration-300">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AI Innovation Scoring</h3>
                    <p className="text-sm text-ui-muted leading-relaxed mb-6">
                      Every document receives an automated R&D novelty, complexity, and commercialization grade powered by advanced language models for rapid filtering.
                    </p>
                  </div>
                  <div className="bg-bg-main rounded-2xl p-4 border border-ui-border relative overflow-hidden flex justify-around items-center h-28">
                    <div className="text-center">
                      <div className="text-2xl font-black text-ui-black">8.7</div>
                      <div className="text-[10px] text-ui-muted uppercase font-bold tracking-wider">Novelty</div>
                    </div>
                    <div className="w-[1px] h-10 bg-ui-border"></div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-ui-black">9.2</div>
                      <div className="text-[10px] text-ui-muted uppercase font-bold tracking-wider">Complexity</div>
                    </div>
                    <div className="w-[1px] h-10 bg-ui-border"></div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-ui-black">A+</div>
                      <div className="text-[10px] text-ui-muted uppercase font-bold tracking-wider">Grade</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'graphs' && (
              <motion.div
                key="graphs"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-8 w-full"
              >
                {/* Interactive Node Graph */}
                <div className="bg-white rounded-3xl p-10 border border-ui-border group hover:border-ui-divider hover:shadow-md transition-all duration-350 flex flex-col justify-between shadow-sm min-h-[440px]">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-ui-black mb-6 border border-ui-border group-hover:bg-ui-black group-hover:text-white transition-all duration-300">
                      <Network className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Interactive Knowledge Graphs</h3>
                    <p className="text-sm text-ui-muted leading-relaxed mb-6">
                      Explore multi-dimensional relationships between researchers, publications, tags, and citations. Detect unexpected scientific overlaps and collaborations instantly.
                    </p>
                  </div>
                  <div className="bg-bg-main rounded-2xl p-4 border border-ui-border relative overflow-hidden flex justify-center items-center h-28">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.03)_0%,transparent_60%)]"></div>
                    <div className="relative z-10 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 text-ui-black">
                      <Share2 className="w-10 h-10" />
                    </div>
                  </div>
                </div>

                {/* Document Insights */}
                <div className="bg-white rounded-3xl p-10 border border-ui-border group hover:border-ui-divider hover:shadow-md transition-all duration-350 flex flex-col justify-between shadow-sm min-h-[440px]">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-ui-black mb-6 border border-ui-border group-hover:bg-ui-black group-hover:text-white transition-all duration-300">
                      <Database className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">In-Depth Document Insights</h3>
                    <p className="text-sm text-ui-muted leading-relaxed mb-6">
                      Deep dive into specific files. Extract automated innovation abstracts, methodologies, timeline estimates, and citation clusters directly in the UI.
                    </p>
                  </div>
                  <div className="bg-bg-main rounded-2xl p-4 border border-ui-border relative overflow-hidden flex flex-col gap-2 justify-center h-28">
                    <div className="text-[11px] font-bold text-ui-black border-l-2 border-accent-blue pl-2">Methodology Highlight:</div>
                    <div className="text-[10px] text-ui-muted leading-relaxed line-clamp-2">
                      Utilizes liquid-phase high-pressure chemical vapor deposition to bypass standard transition metal catalyst requirements...
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics_access' && (
              <motion.div
                key="analytics_access"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-8 w-full"
              >
                {/* Analytics */}
                <div className="bg-white rounded-3xl p-10 border border-ui-border group hover:border-ui-divider hover:shadow-md transition-all duration-350 flex flex-col justify-between shadow-sm min-h-[440px]">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-ui-black mb-6 border border-ui-border group-hover:bg-ui-black group-hover:text-white transition-all duration-300">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">R&D Analytics Dashboard</h3>
                    <p className="text-sm text-ui-muted leading-relaxed mb-6">
                      Monitor overall research pipeline progress, total uploads, search analytics, most referenced tags, and system compute graphs in an elegant dashboard.
                    </p>
                  </div>
                  <div className="bg-bg-main rounded-2xl p-4 border border-ui-border relative overflow-hidden flex items-end gap-1.5 justify-center h-28">
                    <div className="w-4 h-8 bg-ui-border rounded-t group-hover:h-12 transition-all duration-500"></div>
                    <div className="w-4 h-14 bg-ui-border rounded-t group-hover:h-20 transition-all duration-500 delay-75"></div>
                    <div className="w-4 h-10 bg-ui-black rounded-t group-hover:h-16 transition-all duration-500 delay-100"></div>
                    <div className="w-4 h-16 bg-ui-border rounded-t group-hover:h-24 transition-all duration-500 delay-150"></div>
                  </div>
                </div>

                {/* Google 2.0 OAuth */}
                <div className="bg-white rounded-3xl p-10 border border-ui-border group hover:border-ui-divider hover:shadow-md transition-all duration-350 flex flex-col justify-between shadow-sm min-h-[440px]">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-ui-black mb-6 border border-ui-border group-hover:bg-ui-black group-hover:text-white transition-all duration-300">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Google OAuth & MongoDB</h3>
                    <p className="text-sm text-ui-muted leading-relaxed mb-6">
                      Sign up seamlessly in one click using Google 2.0 integration. All user metadata, search profiles, and parsed documents are securely persisted in cloud-scalable MongoDB.
                    </p>
                  </div>
                  <div className="bg-bg-main rounded-2xl p-4 border border-ui-border relative overflow-hidden flex flex-col gap-2 justify-center items-center h-28">
                    <div className="flex items-center gap-2 bg-white border border-ui-border px-4 py-2 rounded-xl text-xs shadow-sm font-semibold text-ui-black">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Continue with Google
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-bg-main pt-24 pb-12 relative overflow-hidden border-t border-ui-border/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-black/30 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <BrainCircuit className="text-ui-black w-8 h-8" />
                <span className="text-2xl font-bold tracking-tight text-ui-black">Nexus<span className="opacity-80">AI</span></span>
              </div>
              <p className="text-ui-muted max-w-sm leading-relaxed mb-8">
                Empowering R&D teams with intelligent natural language search and automated insight extraction. Transform your data into discovery.
              </p>
              <div className="flex gap-4">
                {/* Twitter / X */}
                <a href="#" className="w-10 h-10 rounded-xl bg-ui-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 text-ui-muted">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="w-10 h-10 rounded-xl bg-ui-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 text-ui-muted">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                {/* GitHub */}
                <a href="#" className="w-10 h-10 rounded-xl bg-ui-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 text-ui-muted">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </a>
                {/* Discord */}
                <a href="#" className="w-10 h-10 rounded-xl bg-ui-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 text-ui-muted">
                  <span className="sr-only">Discord</span>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                </a>
              </div>
            </div>

            {/* Links Sections */}
            <div>
              <h4 className="font-bold text-ui-black mb-6 uppercase tracking-wider text-xs">Product</h4>
              <ul className="space-y-4">
                {['AI Search', 'Knowledge Graph', 'Document Insight', 'Analytics', 'Integrations'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-ui-muted hover:text-black transition-colors text-sm font-medium">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-ui-black mb-6 uppercase tracking-wider text-xs">Solutions</h4>
              <ul className="space-y-4">
                {['Biotech R&D', 'Material Science', 'Energy Research', 'Quantum Computing', 'Pharma'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-ui-muted hover:text-black transition-colors text-sm font-medium">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-ui-black mb-6 uppercase tracking-wider text-xs">Support</h4>
              <ul className="space-y-4">
                {['Documentation', 'API Reference', 'Status', 'Security', 'Contact Us'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-ui-muted hover:text-black transition-colors text-sm font-medium">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-ui-border/30 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-ui-muted text-sm font-medium">
              © 2026 Nexus AI R&D Platform. All rights reserved.
            </p>
            <div className="flex gap-8">
              {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((link) => (
                <a key={link} href="#" className="text-ui-muted hover:text-ui-black transition-colors text-sm font-medium">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

