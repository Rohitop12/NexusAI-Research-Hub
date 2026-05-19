import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { 
    BrainCircuit, FileText, Zap, Award, Sparkles, Hash, AlertTriangle, 
    Link as LinkIcon, Clock, ChevronDown, ChevronUp, MessageSquare, Send, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function DocumentInsight({ document }) {
    const ai = document.ai_analysis || {};
    const metadata = ai.metadata || {};
    const scores = ai.scores || {};
    const [activeTab, setActiveTab] = useState('insights'); // insights, chat, graph
    const [chatHistory, setChatHistory] = useState([
        { text: "Hello! I'm the Nexus AI analyst assigned to this document. What would you like to know about it?", sender: 'ai' }
    ]);
    const [messageInput, setMessageInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newHistory = [...chatHistory, { text: messageInput, sender: 'user' }];
        setChatHistory(newHistory);
        setMessageInput('');
        setIsChatLoading(true);

        try {
            const response = await axios.post(`/api/documents/${document.id}/chat`, {
                message: messageInput,
                history: chatHistory
            });
            setChatHistory([...newHistory, { text: response.data.message, sender: 'ai' }]);
        } catch (error) {
            setChatHistory([...newHistory, { text: "Error connecting to AI. Please try again.", sender: 'ai', isError: true }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    // Circular Progress Component
    const CircularScore = ({ score, label, color }) => {
        const radius = 30;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - ((score || 0) / 100) * circumference;

        return (
            <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-ui-border" />
                        <motion.circle 
                            cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" 
                            strokeDasharray={circumference} 
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={color}
                        />
                    </svg>
                    <span className="absolute text-lg font-bold text-ui-heading">{score}%</span>
                </div>
                <span className="text-xs font-semibold text-ui-muted mt-2 uppercase tracking-wider">{label}</span>
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col lg:flex-row gap-6 max-w-full h-[calc(100vh-100px)]">
                
                {/* LEFT PANEL: Document Viewer */}
                <div className="w-full lg:w-1/2 flex flex-col bg-white rounded-2xl border border-ui-border shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-ui-divider bg-bg-main flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-accent-blue" />
                            <h2 className="font-bold text-ui-heading truncate">{document.title}</h2>
                        </div>
                        <span className="text-xs text-ui-muted bg-white px-3 py-1 rounded-full border border-ui-border">PDF Viewer</span>
                    </div>
                    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                        {/* Simulated PDF Viewer using extracted text */}
                        <div className="bg-white p-8 shadow-sm rounded-xl border border-gray-200 min-h-full">
                            <h1 className="text-3xl font-bold text-center mb-6">{document.title}</h1>
                            <div className="text-center text-sm text-gray-500 mb-8 pb-8 border-b">
                                {(metadata.authors || []).join(', ')} <br/>
                                {metadata.department} • {metadata.published_date}
                            </div>
                            <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {document.extracted_text || "No text extracted."}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: AI Dashboard */}
                <div className="w-full lg:w-1/2 flex flex-col bg-bg-main rounded-2xl border border-ui-border shadow-sm overflow-hidden">
                    
                    {/* Tabs */}
                    <div className="flex border-b border-ui-divider bg-white">
                        <button onClick={() => setActiveTab('insights')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'insights' ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-ui-muted hover:text-ui-heading'}`}>
                            <Sparkles className="w-4 h-4" /> AI Insights
                        </button>
                        <button onClick={() => setActiveTab('chat')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'chat' ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-ui-muted hover:text-ui-heading'}`}>
                            <MessageSquare className="w-4 h-4" /> Ask Document
                        </button>
                        <button onClick={() => setActiveTab('graph')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'graph' ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-ui-muted hover:text-ui-heading'}`}>
                            <LinkIcon className="w-4 h-4" /> Knowledge Graph
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        
                        {activeTab === 'insights' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                
                                {/* Duplicate Warning */}
                                {(ai.similar_research && ai.similar_research.length > 0 && ai.similar_research[0].similarity > 75) && (
                                    <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-orange-700 font-bold text-sm">Duplicate Detection Warning</h4>
                                            <p className="text-orange-600/80 text-xs mt-1">This paper is {ai.similar_research[0].similarity}% similar to existing research: "{ai.similar_research[0].title}".</p>
                                        </div>
                                    </div>
                                )}

                                {/* Innovation Scores */}
                                <div>
                                    <h3 className="text-xs font-bold text-ui-muted uppercase tracking-wider mb-4 flex items-center gap-2"><Award className="w-4 h-4" /> AI Evaluation Metrics</h3>
                                    <div className="flex justify-around bg-white p-6 rounded-2xl border border-ui-border shadow-sm">
                                        <CircularScore score={scores.innovation} label="Innovation" color="text-accent-blue" />
                                        <CircularScore score={scores.complexity} label="Complexity" color="text-accent-purple" />
                                        <CircularScore score={scores.impact} label="Impact" color="text-accent-teal" />
                                    </div>
                                </div>

                                {/* AI Summary */}
                                <div>
                                    <h3 className="text-xs font-bold text-ui-muted uppercase tracking-wider mb-3 flex items-center gap-2"><BrainCircuit className="w-4 h-4" /> Executive Summary</h3>
                                    <div className="bg-white p-5 rounded-xl border border-ui-border text-sm text-ui-heading leading-relaxed shadow-sm">
                                        {ai.summary}
                                    </div>
                                </div>

                                {/* Key Findings & Scope */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-xl border border-ui-border shadow-sm">
                                        <h3 className="text-xs font-bold text-ui-muted uppercase tracking-wider mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-accent-yellow" /> Key Findings</h3>
                                        <ul className="space-y-2">
                                            {(ai.key_findings || []).map((finding, idx) => (
                                                <li key={idx} className="text-xs text-ui-heading flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-yellow mt-1.5 shrink-0" /> {finding}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-ui-border shadow-sm">
                                        <h3 className="text-xs font-bold text-ui-muted uppercase tracking-wider mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-accent-blue" /> Future Scope</h3>
                                        <ul className="space-y-2">
                                            {(ai.future_scope || []).map((scope, idx) => (
                                                <li key={idx} className="text-xs text-ui-heading flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1.5 shrink-0" /> {scope}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* AI Tags */}
                                <div>
                                    <h3 className="text-xs font-bold text-ui-muted uppercase tracking-wider mb-3 flex items-center gap-2"><Hash className="w-4 h-4" /> Generated Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(ai.tags || []).map((tag, idx) => (
                                            <span key={idx} className="bg-accent-blue/10 text-accent-blue px-3 py-1 rounded-full text-xs font-bold">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </motion.div>
                        )}

                        {activeTab === 'chat' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-white rounded-2xl border border-ui-border overflow-hidden">
                                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                                    {chatHistory.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                                msg.sender === 'user' ? 'bg-accent-blue text-white rounded-tr-sm' : 
                                                msg.isError ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-sm' : 'bg-bg-main border border-ui-border text-ui-heading rounded-tl-sm'
                                            }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {isChatLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-bg-main border border-ui-border p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                                                <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 border-t border-ui-divider bg-bg-main">
                                    <form onSubmit={handleSendMessage} className="relative">
                                        <input 
                                            type="text" 
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            placeholder="Ask 'Summarize methodology'..." 
                                            className="w-full bg-white border border-ui-border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-accent-blue transition-colors"
                                            disabled={isChatLoading}
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={isChatLoading || !messageInput.trim()}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-accent-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                    <div className="mt-2 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                                        {["Summarize this", "What problem does this solve?", "Explain methodology"].map((suggestion) => (
                                            <button 
                                                key={suggestion}
                                                onClick={() => setMessageInput(suggestion)}
                                                className="shrink-0 text-[10px] font-bold text-ui-muted bg-white border border-ui-border px-2 py-1 rounded-full hover:border-accent-blue hover:text-accent-blue transition-colors"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'graph' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full bg-white rounded-2xl border border-ui-border shadow-sm p-6 flex flex-col items-center justify-center text-center">
                                <LinkIcon className="w-16 h-16 text-ui-muted mb-4 opacity-50" />
                                <h3 className="text-lg font-bold text-ui-heading mb-2">Knowledge Graph Generator</h3>
                                <p className="text-sm text-ui-muted max-w-xs">
                                    The AI has extracted semantic relationships from this document. In a production environment, this will render an interactive canvas visualizing entities and connections.
                                </p>
                                <div className="mt-8 text-left w-full">
                                    <h4 className="text-xs font-bold uppercase text-ui-muted mb-3">Extracted Nodes</h4>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {((ai.knowledge_graph || {}).nodes || []).slice(0, 5).map((node, idx) => (
                                            <span key={idx} className="text-xs bg-bg-main border border-ui-border px-2 py-1 rounded-md">{node.label}</span>
                                        ))}
                                        {((ai.knowledge_graph || {}).nodes || []).length > 5 && <span className="text-xs text-ui-muted px-2 py-1">...and more</span>}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
