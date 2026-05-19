import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { motion } from 'framer-motion';
import {
  TrendingUp, FileText, Search, UploadCloud, Users,
  BarChart3, Activity, Calendar, ArrowUpRight, Download
} from 'lucide-react';

// ── Data ────────────────────────────────────────────────────────────────────

const monthlyUploads = [12, 19, 8, 27, 34, 22, 41, 38, 29, 45, 52, 48];
const monthlySearches = [45, 62, 38, 74, 88, 67, 95, 82, 71, 103, 118, 110];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const domainData = [
  { label: 'AI / Machine Learning', value: 38, color: '#111827' },
  { label: 'NLP & Language Models', value: 24, color: '#374151' },
  { label: 'Materials Science', value: 18, color: '#6B7280' },
  { label: 'Quantum Computing', value: 12, color: '#9CA3AF' },
  { label: 'Biotech & Pharma', value: 8, color: '#D1D5DB' },
];

const topDocuments = [
  { title: 'LLM Fine-Tuning for Medical Diagnostics', domain: 'Healthcare AI', score: 94, views: 312 },
  { title: 'Solid-State Battery Thermal Analysis', domain: 'Energy Storage', score: 88, views: 245 },
  { title: 'Graphene Synthesis Optimization', domain: 'Materials Science', score: 85, views: 198 },
  { title: 'Quantum Error Correction Methods', domain: 'Quantum Computing', score: 82, views: 167 },
  { title: 'Protein Folding with AlphaFold 3', domain: 'Biotech', score: 79, views: 143 },
];

const recentSearches = [
  { query: 'quantum neural networks review', count: 12, trend: '+3' },
  { query: 'solid state battery 2026', count: 9, trend: '+1' },
  { query: 'LLM fine tuning medical', count: 8, trend: '+5' },
  { query: 'graphene polymer synthesis', count: 6, trend: '0' },
  { query: 'semantic search embeddings', count: 5, trend: '+2' },
];

const kpis = [
  { label: 'Documents Indexed', value: '1,284', change: '+48 this month', icon: FileText, up: true },
  { label: 'Total Searches', value: '8,943', change: '+312 this week', icon: Search, up: true },
  { label: 'Files Uploaded', value: '392', change: '+22 this month', icon: UploadCloud, up: true },
  { label: 'Active Users', value: '47', change: '+5 this week', icon: Users, up: true },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function BarChart({ data, color = '#111', label }) {
  const max = Math.max(...data);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-1.5 h-32">
        {data.map((v, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${(v / max) * 100}%` }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            className="flex-1 rounded-t-md group relative cursor-default"
            style={{ backgroundColor: color, opacity: 0.15 + (v / max) * 0.85 }}
          >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-ui-black text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {v} {label}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-1.5">
        {months.map((m, i) => (
          <span key={i} className="flex-1 text-center text-[9px] text-ui-muted font-medium">{m}</span>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const r = 60, cx = 80, cy = 80, stroke = 24;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-8">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth={stroke} />
        {data.map((d, i) => {
          const pct = d.value / total;
          const dash = pct * circumference;
          const offset = circumference * (1 - cumulative / total) - circumference * 0.25;
          cumulative += d.value;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset + circumference}
              className="transition-all duration-500"
            />
          );
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#111827">{total}%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#6B7280">coverage</text>
      </svg>
      <div className="space-y-2.5 flex-1">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></div>
            <span className="text-xs text-ui-muted flex-1 truncate">{d.label}</span>
            <span className="text-xs font-bold text-ui-heading">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Analytics() {
  const [period, setPeriod] = useState('12mo');

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full pb-20">

        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ui-heading mb-1">Analytics</h1>
            <p className="text-ui-muted text-sm">Platform usage, research trends, and document insights.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-ui-border rounded-xl overflow-hidden text-sm font-medium">
              {['7d', '30d', '12mo'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 transition-colors ${period === p ? 'bg-ui-black text-white' : 'text-ui-muted hover:text-ui-black'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-ui-border rounded-xl text-sm font-medium hover:bg-bg-main transition-colors text-ui-heading">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-ui-border rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-bg-main rounded-xl">
                  <kpi.icon className="w-5 h-5 text-ui-muted" />
                </div>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5" /> {kpi.up ? '↑' : '↓'}
                </span>
              </div>
              <p className="text-2xl font-bold text-ui-heading">{kpi.value}</p>
              <p className="text-xs text-ui-muted mt-0.5">{kpi.change}</p>
              <p className="text-xs font-medium text-ui-muted mt-1 uppercase tracking-wider">{kpi.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Upload Trend */}
          <div className="bg-white border border-ui-border rounded-2xl p-6 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-ui-heading">Activity Trends</h3>
                <p className="text-xs text-ui-muted mt-0.5">Monthly uploads & searches over the last 12 months</p>
              </div>
              <div className="flex gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-ui-black inline-block"></span>Uploads</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-ui-border inline-block border border-ui-divider"></span>Searches</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-ui-muted uppercase tracking-wider mb-1 font-semibold">Uploads</p>
                <BarChart data={monthlyUploads} color="#111827" label="docs" />
              </div>
              <div className="pt-4 border-t border-ui-border">
                <p className="text-[10px] text-ui-muted uppercase tracking-wider mb-1 font-semibold">Searches</p>
                <BarChart data={monthlySearches} color="#6B7280" label="queries" />
              </div>
            </div>
          </div>

          {/* Domain Distribution */}
          <div className="bg-white border border-ui-border rounded-2xl p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="font-bold text-ui-heading">Research Domains</h3>
              <p className="text-xs text-ui-muted mt-0.5">Document distribution by topic</p>
            </div>
            <DonutChart data={domainData} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Top Documents */}
          <div className="bg-white border border-ui-border rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-ui-border flex justify-between items-center">
              <div>
                <h3 className="font-bold text-ui-heading">Top Documents</h3>
                <p className="text-xs text-ui-muted mt-0.5">Ranked by innovation score</p>
              </div>
              <BarChart3 className="w-5 h-5 text-ui-muted" />
            </div>
            <div className="divide-y divide-ui-border">
              {topDocuments.map((doc, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-bg-main transition-colors group cursor-pointer">
                  <span className="text-sm font-bold text-ui-muted w-5 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ui-heading truncate group-hover:text-ui-black">{doc.title}</p>
                    <p className="text-xs text-ui-muted">{doc.domain} · {doc.views} views</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex-1 w-16 h-1.5 bg-bg-main rounded-full overflow-hidden">
                      <div className="h-full bg-ui-black rounded-full" style={{ width: `${doc.score}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-ui-heading w-8 text-right">{doc.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div className="bg-white border border-ui-border rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-ui-border flex justify-between items-center">
              <div>
                <h3 className="font-bold text-ui-heading">Popular Searches</h3>
                <p className="text-xs text-ui-muted mt-0.5">Most frequent queries this week</p>
              </div>
              <Activity className="w-5 h-5 text-ui-muted" />
            </div>
            <div className="divide-y divide-ui-border">
              {recentSearches.map((s, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-bg-main transition-colors group cursor-pointer">
                  <Search className="w-4 h-4 text-ui-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ui-heading truncate group-hover:text-ui-black">"{s.query}"</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-ui-muted">{s.count}x</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${s.trend.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-ui-muted bg-bg-main'}`}>
                      {s.trend !== '0' ? s.trend : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-ui-border">
              <button className="w-full text-center text-xs text-ui-muted hover:text-ui-black transition-colors font-medium flex items-center justify-center gap-1">
                View all search history <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
