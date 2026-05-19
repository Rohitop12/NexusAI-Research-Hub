import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Target,
  Zap,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ChevronRight,
  BookOpen,
  Search,
  UploadCloud,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { getActivity, formatRelativeTime } from '@/utils/activity';

const stats = [
  { label: 'Research Papers', value: '1.2M+', icon: FileText, change: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Projects', value: '842', icon: Target, change: '+5.4%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Researchers', value: '12.4K', icon: Users, change: '+2.1%', color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Innovation Score', value: '9.2', icon: Zap, change: '+0.8', color: 'text-amber-600', bg: 'bg-amber-50' },
];

function getActivityIcon(type) {
  if (type === 'Search') return <Search className="w-5 h-5" />;
  if (type === 'Upload') return <UploadCloud className="w-5 h-5" />;
  if (type === 'Paper') return <BookOpen className="w-5 h-5" />;
  return <Clock className="w-5 h-5" />;
}

function getActivityStyle(type) {
  if (type === 'Search') return 'bg-blue-50 text-blue-600';
  if (type === 'Upload') return 'bg-emerald-50 text-emerald-600';
  if (type === 'Paper') return 'bg-violet-50 text-violet-600';
  return 'bg-ui-border text-ui-muted';
}

export default function Overview() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    setActivity(getActivity());
    // Refresh every 10s in case another tab adds an entry
    const interval = setInterval(() => setActivity(getActivity()), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ui-heading mb-2">Platform Overview</h1>
            <p className="text-ui-muted text-sm">Welcome back. Here is what's happening across the R&D landscape today.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-ui-border text-ui-heading rounded-xl text-sm font-medium hover:bg-bg-main transition-colors">
              Export Report
            </button>
            <Link
              href="/dashboard/upload"
              className="px-4 py-2 bg-ui-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors flex items-center gap-2"
            >
              Add New Data <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-ui-border p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-colors`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3" /> {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-ui-heading mb-1">{stat.value}</h3>
              <p className="text-ui-muted text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-bold text-ui-heading">Recent Activity</h2>
              <Link href="/dashboard/search" className="text-sm text-ui-muted font-semibold flex items-center gap-1 hover:text-ui-black transition-colors">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white border border-ui-border rounded-3xl overflow-hidden shadow-sm">
              {activity.length === 0 ? (
                <div className="p-10 flex flex-col items-center justify-center text-center gap-3">
                  <Clock className="w-10 h-10 text-ui-border" />
                  <p className="text-ui-muted text-sm">No recent activity yet.</p>
                  <p className="text-ui-muted text-xs">Search for papers or upload documents to see your activity here.</p>
                </div>
              ) : (
                activity.slice(0, 8).map((item, idx) => (
                  <Link
                    key={item.id}
                    href={item.href || '/dashboard'}
                    className={`group p-5 flex items-center gap-4 hover:bg-bg-main transition-colors cursor-pointer ${idx !== Math.min(activity.length, 8) - 1 ? 'border-b border-ui-divider' : ''}`}
                  >
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${getActivityStyle(item.type)}`}>
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-ui-heading truncate">{item.title}</h4>
                      <p className="text-xs text-ui-muted mt-0.5">{item.type}{item.meta ? ` • ${item.meta}` : ''}</p>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-2">
                      <span className="text-xs font-medium text-ui-muted">{formatRelativeTime(item.time)}</span>
                      <ChevronRight className="w-4 h-4 text-ui-muted opacity-0 group-hover:opacity-100" />
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Knowledge Map Preview placeholder */}
            <div className="bg-white border border-ui-border rounded-3xl p-8 shadow-sm overflow-hidden relative group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-ui-heading">Research Distribution</h3>
                  <p className="text-ui-muted text-xs">Concept clusters detected across current projects</p>
                </div>
                <Link href="/dashboard/graph" className="p-2 hover:bg-bg-main rounded-xl transition-colors">
                  <ArrowUpRight className="w-5 h-5 text-ui-muted group-hover:text-ui-black transition-colors" />
                </Link>
              </div>
              <div className="h-48 flex items-end gap-3 px-4">
                {[60, 80, 45, 90, 55, 70, 40, 85, 65, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-bg-main rounded-t-lg relative group/bar"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute inset-0 bg-ui-black opacity-0 group-hover/bar:opacity-10 transition-opacity rounded-t-lg"></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between px-2 text-[10px] font-bold text-ui-muted uppercase tracking-widest">
                <span>NLP</span>
                <span>Energy</span>
                <span>Quantum</span>
                <span>BioTech</span>
                <span>Material</span>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="bg-ui-black rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full opacity-5 blur-3xl group-hover:opacity-10 transition-opacity"></div>
              <h3 className="text-xl font-bold mb-4 relative z-10">AI Assistant</h3>
              <p className="text-slate-400 text-sm mb-6 relative z-10">Ask anything about your R&D data. I can summarize papers, find trends, or help with citations.</p>
              <Link
                href="/dashboard/chat"
                className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors relative z-10"
              >
                Start Chatting <MessageSquare className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white border border-ui-border rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-ui-heading mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ui-muted">Database Sync</span>
                  <span className="text-green-600 font-bold flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Online</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ui-muted">AI Model (Gemini)</span>
                  <span className="text-green-600 font-bold flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Active</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ui-muted">OpenAlex Index</span>
                  <span className="text-green-600 font-bold flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Updated</span>
                </div>
              </div>
            </div>

            <div className="bg-ui-border/30 border border-ui-border rounded-3xl p-6">
              <h4 className="font-bold text-ui-heading mb-2">New Platform Update</h4>
              <p className="text-ui-muted text-xs leading-relaxed">We've integrated OpenAlex for better semantic research search. Try it in the search tab!</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const MessageSquare = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);
