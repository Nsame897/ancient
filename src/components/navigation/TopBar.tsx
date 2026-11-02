import React from 'react';
import { Shield, Lock, Search, MoreVertical, Plus, Sliders, ShieldCheck } from 'lucide-react';
import { NavigationTab, PrivacySettings } from '../../types/chatnova';

interface TopBarProps {
  activeTab: NavigationTab;
  privacy: PrivacySettings;
  onOpenPrivacy: () => void;
  onOpenAdmin: () => void;
  onOpenNewChat: () => void;
  onOpenTheme: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  privacy,
  onOpenPrivacy,
  onOpenAdmin,
  onOpenNewChat,
  onOpenTheme,
  searchQuery,
  onSearchChange,
}) => {
  const titles: Record<NavigationTab, string> = {
    chats: 'ChatNova',
    status: 'Status Updates',
    communities: 'Communities',
    calls: 'Call History',
    settings: 'Settings & Privacy',
  };

  return (
    <header className="sticky top-0 z-30 bg-[#070709]/95 backdrop-blur-xl border-b border-[#1E1E26] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand or Section Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-[1px] flex items-center justify-center shadow-lg shadow-violet-500/10">
            <div className="w-full h-full bg-[#070709] rounded-[11px] flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white">
                {titles[activeTab]}
              </h1>
              {privacy.hideOnlineStatus && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-800/40 font-medium">
                  Stealth
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              E2EE Active · Double Ratchet v2
            </p>
          </div>
        </div>

        {/* Center / Search on desktop */}
        <div className="hidden sm:flex flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search chats, contacts, messages..."
              className="w-full bg-[#111116] border border-[#1E1E26] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Privacy Toggle */}
          <button
            onClick={onOpenPrivacy}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              privacy.hideOnlineStatus
                ? 'bg-violet-950/60 text-violet-300 border border-violet-800/50'
                : 'text-slate-400 hover:text-white hover:bg-[#111116]'
            }`}
            title="Privacy & Cloak Controls"
            aria-label="Privacy Settings"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Theme customizer quick trigger */}
          <button
            onClick={onOpenTheme}
            className="p-2 text-slate-400 hover:text-white hover:bg-[#111116] rounded-xl transition-colors cursor-pointer"
            title="Theme & Customization Studio"
            aria-label="Theme Customization"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Admin console button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-[#111116] rounded-xl transition-colors cursor-pointer"
            title="Admin Security & Trust Dashboard"
            aria-label="Admin Dashboard"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* New Chat Primary Action */}
          {activeTab === 'chats' && (
            <button
              onClick={onOpenNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-violet-600/20 active:scale-95 cursor-pointer ml-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">New Chat</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
