import React, { useState } from 'react';
import { Terminal, Trash2, Download, Search, Activity, Sparkles } from 'lucide-react';
import { TelemetryEvent } from '../types/presence';

interface TelemetryLogProps {
  events: TelemetryEvent[];
  onClear: () => void;
}

export const TelemetryLog: React.FC<TelemetryLogProps> = ({ events, onClear }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = events.filter((ev) => {
    if (filterType !== 'all' && ev.eventType !== filterType) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        ev.peerName.toLowerCase().includes(q) ||
        ev.details.toLowerCase().includes(q) ||
        ev.eventType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `presence-activity-log-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Live Connection Activity Stream
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Watch real-time WebSocket heartbeats, tab switches, and notification changes as they happen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportJson}
            disabled={events.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
            title="Download full JSON protocol stream"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Log</span>
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-900/40 hover:bg-rose-900/50 rounded-lg transition-colors cursor-pointer"
            title="Clear stream"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl shrink-0 overflow-x-auto">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'HEARTBEAT', label: 'Heartbeats' },
            { id: 'VISIBILITY_CHANGE', label: 'Tab Switches' },
            { id: 'NOTIFICATION_TOGGLE', label: 'Notification Changes' },
            { id: 'SOCKET_EVENT', label: 'Network Events' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterType === item.id
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full sm:w-60 bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Event Stream List */}
      <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 font-mono text-xs max-h-96 overflow-y-auto space-y-2">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-sans text-xs">
            No events match your current filter. Try moving your mouse or changing a peer&apos;s notification mode above!
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 hover:border-slate-700/80 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 mb-1.5 text-[11px]">
                <span className="text-slate-500 tabular-nums">[{ev.timestamp}]</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    ev.eventType === 'HEARTBEAT'
                      ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-800/40'
                      : ev.eventType === 'VISIBILITY_CHANGE'
                      ? 'text-amber-400 bg-amber-950/60 border border-amber-800/40'
                      : ev.eventType === 'NOTIFICATION_TOGGLE'
                      ? 'text-rose-400 bg-rose-950/60 border border-rose-800/40'
                      : 'text-purple-400 bg-purple-950/60 border border-purple-800/40'
                  }`}
                >
                  {ev.eventType === 'VISIBILITY_CHANGE' ? 'TAB SWITCH' : ev.eventType}
                </span>
                <span className="text-slate-200 font-bold">{ev.peerName}</span>
                <span className="text-slate-500">→</span>
                <span
                  className={`font-bold uppercase ${
                    ev.status === 'online'
                      ? 'text-emerald-400'
                      : ev.status === 'away'
                      ? 'text-amber-400'
                      : ev.status === 'hidden'
                      ? 'text-purple-400'
                      : 'text-slate-500'
                  }`}
                >
                  {ev.status}
                </span>
              </div>

              <div className="text-slate-300 pl-0.5 text-[12px] font-sans leading-relaxed">
                {ev.details}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
