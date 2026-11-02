import React, { useState } from 'react';
import { Smartphone, Laptop, Globe, Bell, BellOff, VolumeX, Shield, Radio, Send, CheckCircle2, Search, Filter } from 'lucide-react';
import { PeerUser, NotificationState, AppState, PrivacySetting, PresenceVerdict } from '../types/presence';

interface PeerGridProps {
  peers: PeerUser[];
  onUpdatePeer: (id: string, updates: Partial<PeerUser>) => void;
  onProbePeer: (peer: PeerUser) => void;
  onSendMessage: (peer: PeerUser) => void;
}

export const PeerGrid: React.FC<PeerGridProps> = ({
  peers,
  onUpdatePeer,
  onProbePeer,
  onSendMessage,
}) => {
  const [filterState, setFilterState] = useState<'all' | 'online' | 'muted'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getVerdict = (peer: PeerUser): PresenceVerdict => {
    if (!peer.socketConnected || peer.appState === 'closed') return 'offline';
    if (peer.privacySetting === 'stealth') return 'hidden';
    if (peer.appState === 'background' || peer.idleSeconds > 30) return 'away';
    return 'online';
  };

  const filteredPeers = peers.filter((p) => {
    const verdict = getVerdict(p);
    if (filterState === 'online' && verdict !== 'online') return false;
    if (filterState === 'muted' && p.notificationState === 'enabled') return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Section Header with Search and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Simulated Teammates & Contacts</span>
            <span className="text-xs font-normal text-slate-400">({peers.length} contacts)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            See how different phones, silent modes, and app states affect online status in real time
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setFilterState('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                filterState === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Contacts
            </button>
            <button
              onClick={() => setFilterState('online')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                filterState === 'online'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Online Only
            </button>
            <button
              onClick={() => setFilterState('muted')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                filterState === 'muted'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Notifications Muted / Off
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Peer Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPeers.map((peer) => {
          const verdict = getVerdict(peer);
          const isMuted = peer.notificationState !== 'enabled';

          return (
            <div
              key={peer.id}
              className={`bg-slate-900/90 border rounded-2xl p-5 transition-all shadow-sm ${
                verdict === 'online' && isMuted
                  ? 'border-cyan-500/40 bg-gradient-to-br from-slate-900/95 to-slate-900/80 ring-1 ring-cyan-500/10'
                  : 'border-slate-800/90 hover:border-slate-700/80'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  {/* Clean Initial Avatar */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border ${
                    verdict === 'online'
                      ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300'
                      : verdict === 'away'
                      ? 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                      : verdict === 'hidden'
                      ? 'bg-purple-950/70 border-purple-500/40 text-purple-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {peer.avatarSeed}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{peer.name}</span>
                      <span className="text-xs text-slate-400">· {peer.role}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        {peer.deviceType === 'ios' && <Smartphone className="w-3.5 h-3.5 text-slate-400" />}
                        {peer.deviceType === 'android' && <Smartphone className="w-3.5 h-3.5 text-slate-400" />}
                        {peer.deviceType === 'desktop' && <Laptop className="w-3.5 h-3.5 text-slate-400" />}
                        {peer.deviceType === 'web' && <Globe className="w-3.5 h-3.5 text-slate-400" />}
                        <span className="capitalize">{peer.deviceType === 'ios' ? 'iPhone' : peer.deviceType}</span>
                      </span>
                      <span>·</span>
                      <span className="font-mono text-[11px] tabular-nums">
                        {peer.socketConnected ? `${peer.latencyMs}ms ping` : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 shrink-0 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      verdict === 'online'
                        ? 'text-emerald-400'
                        : verdict === 'away'
                        ? 'text-amber-400'
                        : verdict === 'hidden'
                        ? 'text-purple-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {verdict === 'hidden' ? 'Appears Offline' : verdict}
                  </span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      verdict === 'online'
                        ? 'bg-emerald-400 ring-2 ring-emerald-500/25'
                        : verdict === 'away'
                        ? 'bg-amber-400 ring-2 ring-amber-500/25'
                        : verdict === 'hidden'
                        ? 'bg-purple-400 ring-2 ring-purple-500/25'
                        : 'bg-slate-700'
                    }`}
                  />
                </div>
              </div>

              {/* Direct Proof Badge: When notifications are off but person is online */}
              {verdict === 'online' && isMuted && (
                <div className="mt-3 p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-xs text-cyan-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">
                      Online Detection Confirmed:
                    </strong>
                    <span>
                      {peer.name}&apos;s notifications are set to <strong className="text-amber-300">{peer.notificationState.toUpperCase()}</strong>. However, because their app is open in foreground, the live socket is active and they are detected as <strong>Online</strong>!
                    </span>
                  </div>
                </div>
              )}

              {/* Interactive Dropdown Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
                {/* 1. App State */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Is App Currently Open?
                  </label>
                  <select
                    value={peer.appState}
                    onChange={(e) => {
                      const val = e.target.value as AppState;
                      onUpdatePeer(peer.id, {
                        appState: val,
                        socketConnected: val !== 'closed',
                      });
                    }}
                    className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="foreground">Active on Screen (Open)</option>
                    <option value="background">Minimized / Background</option>
                    <option value="closed">Closed / Swiped Away</option>
                  </select>
                </div>

                {/* 2. Notification Setting */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Phone Notification Setting
                  </label>
                  <select
                    value={peer.notificationState}
                    onChange={(e) => {
                      onUpdatePeer(peer.id, {
                        notificationState: e.target.value as NotificationState,
                      });
                    }}
                    className={`w-full text-xs border rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer ${
                      peer.notificationState !== 'enabled'
                        ? 'bg-amber-950/20 text-amber-300 border-amber-800/50 font-medium'
                        : 'bg-slate-950 text-slate-200 border-slate-800'
                    }`}
                  >
                    <option value="muted">Muted / Silent Mode</option>
                    <option value="dnd">Do Not Disturb (DND)</option>
                    <option value="disabled">System Alerts Disabled</option>
                    <option value="enabled">Alerts Enabled (Ringer On)</option>
                  </select>
                </div>

                {/* 3. Privacy Policy */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    App Privacy Setting
                  </label>
                  <select
                    value={peer.privacySetting}
                    onChange={(e) => {
                      onUpdatePeer(peer.id, {
                        privacySetting: e.target.value as PrivacySetting,
                      });
                    }}
                    className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="public">Broadcast Online (Normal)</option>
                    <option value="contacts">Contacts Only</option>
                    <option value="stealth">Stealth (Appear Offline)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3.5 mt-3.5 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-mono">
                  {peer.socketConnected ? (
                    <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Keep-alive: Active
                    </span>
                  ) : (
                    <span className="text-slate-500">Socket: Inactive</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSendMessage(peer)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                    title="Send a test message to see how it arrives when notifications are muted"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test Ping</span>
                  </button>

                  <button
                    onClick={() => onProbePeer(peer)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 hover:bg-cyan-900/60 rounded-lg transition-colors cursor-pointer"
                    title="Inspect raw technical packets"
                  >
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
