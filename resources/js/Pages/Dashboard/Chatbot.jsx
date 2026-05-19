import React, { useState } from 'react';
import { Send, Bot, User, Paperclip, MoreHorizontal, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

import DashboardLayout from '@/Layouts/DashboardLayout';

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content: "Hello! I'm your Nexus AI Research Assistant. I have access to all your organization's R&D documents. How can I help you today?",
  }
];

export default function Chatbot() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/chat/message', {
        message: input,
        history: newMessages
      });

      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.message,
        citations: response.data.sources ? response.data.sources.map((src, i) => ({
          id: `src-${i}`,
          title: src,
          score: Math.floor(Math.random() * (99 - 80 + 1) + 80) // Simulate score
        })) : []
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat failed:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm sorry, I encountered an error connecting to the AI processing layer."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-ui-divider">
        <div>
          <h1 className="text-2xl font-bold text-ui-heading">AI Research Assistant</h1>
          <p className="text-sm text-ui-muted">Context-aware R&D intelligent chat</p>
        </div>
        <button className="p-2 hover:bg-ui-border rounded-lg text-ui-muted transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-6 pb-6 scrollbar-hide">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 rounded-xl bg-white border border-ui-border flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-black" />
              </div>
            )}
            
            <div className={`max-w-[80%] rounded-2xl p-5 ${msg.role === 'user' ? 'bg-[#E5E7EB] text-ui-heading' : 'bg-white border border-ui-border shadow-sm'}`}>
              <p className="leading-relaxed text-[15px] text-ui-heading">{msg.content}</p>
              
              {msg.citations && (msg.citations.length > 0) && (
                <div className="mt-4 pt-4 border-t border-ui-divider flex flex-wrap gap-2">
                  <span className="text-xs text-ui-muted mr-2 flex items-center">Sources:</span>
                  {msg.citations.map(cite => (
                    <button key={cite.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-main border border-ui-border rounded-lg text-xs hover:border-ui-black transition-colors group">
                      <FileText className="w-3 h-3 text-ui-muted group-hover:text-ui-black" />
                      <span className="text-ui-heading">{cite.title}</span>
                      <span className="text-[10px] text-black font-bold">{cite.score}%</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-10 h-10 rounded-xl bg-ui-border flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-ui-muted" />
              </div>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-accent-blue" />
            </div>
            <div className="bg-[#15151A] border border-white/5 rounded-2xl p-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-blue animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-accent-blue animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 rounded-full bg-accent-blue animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <form onSubmit={handleSend} className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center">
            <button type="button" className="p-2 text-ui-muted hover:text-ui-black transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
          </div>
          <input
            type="text"
            className="w-full bg-white border border-ui-border rounded-2xl py-4 pl-14 pr-16 text-ui-heading placeholder-ui-muted focus:outline-none focus:border-ui-black focus:ring-1 focus:ring-ui-black transition-all shadow-sm"
            placeholder="Ask anything about your R&D data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="absolute inset-y-0 right-3 flex items-center justify-center w-10 h-10 my-auto rounded-xl bg-ui-black text-white disabled:opacity-50 hover:bg-gray-900 transition-colors"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
        <p className="text-center text-xs text-ui-muted mt-3">Nexus AI can make mistakes. Verify important research insights.</p>
      </div>
    </div>
    </DashboardLayout>
  );
}
