import React from 'react';
import { Link } from '@inertiajs/react';
import { Search as SearchIcon, BrainCircuit, UploadCloud, PieChart, MessageSquare, LayoutDashboard, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-bg-main text-ui-heading font-sans selection:bg-ui-border">
      {/* Sidebar */}
      <div className="w-64 border-r border-ui-border bg-white p-4 flex flex-col gap-1 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 mb-8 px-2 py-4 hover:opacity-70 transition-opacity">
          <BrainCircuit className="text-ui-black w-6 h-6" />
          <span className="text-xl font-bold tracking-wide text-ui-black">Nexus<span className="opacity-40">AI</span></span>
        </Link>

        <div className="text-xs font-semibold text-ui-muted uppercase tracking-wider mb-2 px-2">Main Menu</div>
        <Link href="/dashboard" className="px-4 py-2.5 flex items-center gap-3 hover:bg-bg-main rounded-xl text-sm text-ui-muted hover:text-ui-black transition-all duration-200"><LayoutDashboard className="w-4 h-4" /> Overview</Link>
        <Link href="/dashboard/search" className="px-4 py-2.5 flex items-center gap-3 hover:bg-bg-main rounded-xl text-sm text-ui-muted hover:text-ui-black transition-all duration-200"><SearchIcon className="w-4 h-4" /> AI Search</Link>
        <Link href="/dashboard/chat" className="px-4 py-2.5 flex items-center gap-3 hover:bg-bg-main rounded-xl text-sm text-ui-muted hover:text-ui-black transition-all duration-200"><MessageSquare className="w-4 h-4" /> AI Chatbot</Link>
        <Link href="/dashboard/upload" className="px-4 py-2.5 flex items-center gap-3 hover:bg-bg-main rounded-xl text-sm text-ui-muted hover:text-ui-black transition-all duration-200"><UploadCloud className="w-4 h-4" /> Upload Data</Link>

        <div className="text-xs font-semibold text-ui-muted uppercase tracking-wider mt-6 mb-2 px-2">Intelligence</div>
        <Link href="/dashboard/analytics" className="px-4 py-2.5 flex items-center gap-3 hover:bg-bg-main rounded-xl text-sm text-ui-muted hover:text-ui-black transition-all duration-200"><PieChart className="w-4 h-4" /> Analytics</Link>

        {/* Spacer to push logout to bottom */}
        <div className="flex-grow"></div>

        {/* Log Out Button */}
        <Link 
          href="/logout" 
          method="post" 
          as="button" 
          className="px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 hover:text-red-600 rounded-xl text-sm text-ui-muted transition-all duration-200 w-full text-left"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </Link>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <div className="h-16 border-b border-ui-border bg-white flex items-center px-8 z-10 shrink-0">
          <div className="relative w-[480px]">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-muted" />
            <input
              type="text"
              placeholder="Quick search documents, projects, or researchers..."
              className="bg-bg-main border border-ui-border rounded-full pl-10 pr-4 py-2.5 text-sm w-full text-ui-heading placeholder-ui-muted focus:outline-none focus:border-ui-black transition-colors"
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/profile" className="w-9 h-9 rounded-full bg-ui-black border border-ui-black flex items-center justify-center text-sm font-bold text-white hover:opacity-80 transition-opacity">
              R
            </Link>
          </div>
        </div>
        <div className="p-8 flex-1 overflow-y-auto z-10 scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
}
