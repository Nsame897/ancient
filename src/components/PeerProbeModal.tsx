import React from 'react';
import { X, Radio, Activity, CheckCircle2, Shield, BellOff, Bell, Sparkles } from 'lucide-react';
import { PeerUser } from '../types/presence';

interface PeerProbeModalProps {
  peer: PeerUser | null;
  onClose: () => void;
}

export const PeerProbeModal: React.FC<PeerProbeModalProps> = ({ peer, onClose }) => {
  if (!peer) return null;

  const isOnline = peer.socketConnected && peer.appState !== 'closed' && peer.privacySetting !== 'stealth';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Live Connection Inspector: {peer.name}
              </h3>
              <p className="text-xs text-slate-400">
                Device: <span className="capitalize">{peer.deviceType === 'ios' ? 'iPhone' : peer.deviceType}</span> · Notifications: <span className="uppercase text-amber-300">{peer.notificationState}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {/* Key Findings Card */}
          <div className={`p-4 rounded-xl border ${
            isOnline ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Presence Detection Result
              </span>
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                isOnline ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40' : 'text-slate-400 bg-slate-800'
              }`}>
                {isOnline ? 'DETECTED ONLINE' : 'OFFLINE / HIDDEN'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {peer.notificationState !== 'enabled' && isOnline ? (
                <span>
                  🎯 <strong>Confirmed:</strong> Even though {peer.name}&apos;s device has notifications turned to <strong className="text-amber-400">{peer.notificationState.toUpperCase()}</strong>, their application process in foreground keeps an active WebSocket keep-alive connection. The presence server responds with 200 OK ping.
                </span>
              ) : isOnline ? (
                <span>Device is connected with active WebSocket heartbeat and notifications enabled.</span>
              ) : (
                <span>No active socket detected or stealth privacy filter enabled.</span>
              )}
            </p>
          </div>

          {/* Simple Explanation Breakdown */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Phone Alert Channel:</span>
              <strong className="text-amber-300 font-semibold block">
                {peer.notificationState === 'muted' ? 'Muted (No Audio/Ringer)' : peer.notificationState === 'dnd' ? 'Do Not Disturb' : 'Enabled'}
              </strong>
              <span className="text-[11px] text-slate-500 mt-1 block">Handled by device operating system</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Live Connection Channel:</span>
              <strong className="text-emerald-400 font-semibold block">
                {peer.socketConnected ? `Active (${peer.latencyMs}ms ping)` : 'Closed'}
              </strong>
              <span className="text-[11px] text-slate-500 mt-1 block">Direct WebSocket to server</span>
            </div>
          </div>

          {/* Low-level Technical Trace */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400">
              Low-Level Socket Packet Trace:
            </span>

            <div className="bg-slate-950 rounded-xl p-3 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800">
              <div className="text-slate-500">// TCP Keep-Alive Frame</div>
              <div><span className="text-cyan-400">CONNECT</span> wss://presence.app.internal/stream [TLS 1.3]</div>
              <div><span className="text-purple-400">Upgrade:</span> websocket · <span className="text-purple-400">Status:</span> 101 Switching Protocols</div>
              <div className="text-slate-500">// Heartbeat Ping Frame</div>
              <div className="text-emerald-400">&#123; &quot;ping_seq&quot;: 4092, &quot;visibility&quot;: &quot;{peer.appState}&quot;, &quot;idle_sec&quot;: {peer.idleSeconds} &#125;</div>
              <div className="text-slate-500">// Result: Server marks user ONLINE</div>
              <div><span className="text-cyan-400">ACK:</span> PONG received in {peer.latencyMs}ms · Redis TTL refreshed</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
