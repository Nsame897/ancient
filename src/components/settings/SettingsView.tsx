import React from 'react';
import {
  Shield, Palette, Lock, Bell, Database, Info, LogOut, ChevronRight,
  ShieldCheck, Smartphone, Key, Download, Trash2, Sliders, Check
} from 'lucide-react';
import { User, PrivacySettings, ThemeSettings } from '../../types/chatnova';

interface SettingsViewProps {
  currentUser: User;
  privacy: PrivacySettings;
  theme: ThemeSettings;
  onOpenPrivacy: () => void;
  onOpenTheme: () => void;
  onOpenE2EE: () => void;
  onOpenAdmin: () => void;
  onClearStorage: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  privacy,
  theme,
  onOpenPrivacy,
  onOpenTheme,
  onOpenE2EE,
  onOpenAdmin,
  onClearStorage,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="flex items-center gap-4 p-4 bg-[#0D0D12] border border-[#1E1E26] rounded-3xl">
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-violet-500/40"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white truncate">{currentUser.name}</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-950/70 text-violet-300 border border-violet-800/40 font-mono">
              VERIFIED
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">{currentUser.handle}</span>
          <p className="text-xs text-slate-300 mt-1 truncate">{currentUser.bio}</p>
        </div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-4">
        {/* Privacy & Security */}
        <div className="bg-[#0D0D12] border border-[#1E1E26] rounded-3xl overflow-hidden divide-y divide-[#1E1E26]">
          <button
            onClick={onOpenPrivacy}
            className="w-full flex items-center justify-between p-4 hover:bg-[#14141B] transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Privacy & Anti-Surveillance</span>
                <span className="text-[11px] text-slate-400">
                  {privacy.hideOnlineStatus ? 'Stealth Cloaked · ' : 'Online broadcasted · '}
                  {privacy.readReceiptsEnabled ? 'Receipts ON' : 'Receipts OFF'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
          </button>

          <button
            onClick={onOpenTheme}
            className="w-full flex items-center justify-between p-4 hover:bg-[#14141B] transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Theme & Wallpapers</span>
                <span className="text-[11px] text-slate-400 capitalize">
                  {theme.preset} AMOLED · {theme.fontSize} typography
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
          </button>

          <button
            onClick={onOpenE2EE}
            className="w-full flex items-center justify-between p-4 hover:bg-[#14141B] transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Cryptography & Identity Keys</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Double Ratchet v2 · Fingerprint verification
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
          </button>
        </div>

        {/* Administration & Storage */}
        <div className="bg-[#0D0D12] border border-[#1E1E26] rounded-3xl overflow-hidden divide-y divide-[#1E1E26]">
          <button
            onClick={onOpenAdmin}
            className="w-full flex items-center justify-between p-4 hover:bg-[#14141B] transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Trust, Safety & Admin Console</span>
                <span className="text-[11px] text-slate-400">
                  Cluster health, abuse reports & rate limits
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
          </button>

          <button
            onClick={onClearStorage}
            className="w-full flex items-center justify-between p-4 hover:bg-[#14141B] transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Reset Database & Cache</span>
                <span className="text-[11px] text-slate-400">
                  Restore default seeds and initial conversations
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
          </button>
        </div>

        {/* App Info Box */}
        <div className="p-4 rounded-3xl bg-[#0D0D12] border border-[#1E1E26] text-center space-y-1 text-xs text-slate-500">
          <span className="font-bold text-slate-300">ChatNova Enterprise Protocol v2.4.0</span>
          <p className="text-[11px]">
            Original End-to-End Encrypted Architecture · Zero-Knowledge Storage
          </p>
        </div>
      </div>
    </div>
  );
};
