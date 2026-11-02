import React, { useState } from 'react';
import { Shield, Activity, Users, AlertTriangle, UserX, CheckCircle, Terminal, X, RefreshCw } from 'lucide-react';
import { AdminReport } from '../../types/chatnova';
import { INITIAL_ADMIN_REPORTS } from '../../data/mockData';

interface AdminDashboardModalProps {
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ onClose }) => {
  const [reports, setReports] = useState<AdminReport[]>(INITIAL_ADMIN_REPORTS);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'logs'>('overview');

  const handleAction = (id: string, action: 'resolved' | 'suspended') => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] bg-[#0D0D12] border border-[#1E1E26] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E26] bg-[#070709]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ChatNova Admin & Trust Console</h3>
              <p className="text-[11px] text-slate-400">Platform Health, Security Metrics & Abuse Management</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#1E1E26]">
          {[
            { id: 'overview', label: 'Platform Telemetry' },
            { id: 'reports', label: `Abuse Reports (${reports.filter((r) => r.status === 'pending').length})` },
            { id: 'logs', label: 'Audit Trail' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Privacy Warning */}
              <div className="p-3.5 bg-violet-950/20 border border-violet-800/40 rounded-2xl text-violet-200">
                🛡️ <strong>Zero-Access Policy:</strong> ChatNova administrators have no technical access to private messages, voice notes, or shared media. Only aggregate telemetry and metadata reports are visible.
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[#14141B] rounded-2xl border border-[#1E1E26]">
                  <span className="text-[11px] text-slate-400 block mb-1">Active Sockets</span>
                  <span className="text-xl font-bold text-white font-mono">1,420</span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Live Nodes</span>
                </div>
                <div className="p-3.5 bg-[#14141B] rounded-2xl border border-[#1E1E26]">
                  <span className="text-[11px] text-slate-400 block mb-1">E2EE Dispatches</span>
                  <span className="text-xl font-bold text-white font-mono">48,291</span>
                  <span className="text-[10px] text-cyan-400 mt-1 block">Double Ratchet</span>
                </div>
                <div className="p-3.5 bg-[#14141B] rounded-2xl border border-[#1E1E26]">
                  <span className="text-[11px] text-slate-400 block mb-1">Rate Limit Drops</span>
                  <span className="text-xl font-bold text-amber-400 font-mono">14</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Mitigated</span>
                </div>
                <div className="p-3.5 bg-[#14141B] rounded-2xl border border-[#1E1E26]">
                  <span className="text-[11px] text-slate-400 block mb-1">System Health</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono">99.98%</span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Optimal</span>
                </div>
              </div>

              {/* Server Nodes */}
              <div className="p-4 bg-[#14141B] rounded-2xl border border-[#1E1E26] space-y-2">
                <span className="font-bold text-white block">Cluster Core Status:</span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>WebSocket Node #1 (US-East):</span>
                    <span className="text-emerald-400">ONLINE (14ms)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>WebSocket Node #2 (EU-Central):</span>
                    <span className="text-emerald-400">ONLINE (22ms)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Double Ratchet Key Directory:</span>
                    <span className="text-cyan-400">SYNCHRONIZED</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 bg-[#14141B] rounded-2xl border border-[#1E1E26] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm block">
                        {rep.reportedUserName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Reported by {rep.reporterName} · {rep.timestamp}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        rep.status === 'pending'
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-800'
                          : rep.status === 'suspended'
                          ? 'bg-rose-950/70 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 bg-[#070709] p-3 rounded-xl border border-[#1E1E26]">
                    &ldquo;{rep.reason}&rdquo;
                  </p>

                  {rep.status === 'pending' && (
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleAction(rep.id, 'resolved')}
                        className="px-3 py-1.5 bg-[#1E1E28] hover:bg-[#2A2A38] text-slate-200 font-semibold rounded-xl"
                      >
                        Dismiss / Resolve
                      </button>
                      <button
                        onClick={() => handleAction(rep.id, 'suspended')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-md"
                      >
                        Suspend Account
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="p-4 bg-[#070709] rounded-2xl border border-[#1E1E26] font-mono text-[11px] text-slate-300 space-y-1.5 max-h-64 overflow-y-auto">
              <div className="text-slate-500">// Real-time Platform Audit Trail</div>
              <div><span className="text-cyan-400">[SYSTEM]</span> E2EE Socket Gateway listening on :3000</div>
              <div><span className="text-emerald-400">[AUTH]</span> Prekey bundle verified for @alexrivera</div>
              <div><span className="text-purple-400">[RATCHET]</span> Key rotation cycle completed (128 sessions)</div>
              <div><span className="text-amber-400">[RATE_LIMIT]</span> Dropped burst attempt from unknown IP</div>
              <div><span className="text-cyan-400">[CLEANUP]</span> 4 expired status stories purged (24h TTL)</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#070709] border-t border-[#1E1E26] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
