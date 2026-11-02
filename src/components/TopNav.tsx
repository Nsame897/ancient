import React from 'react';
import { Activity, RotateCcw } from 'lucide-react';

interface TopNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onReset: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeSection,
  onNavigate,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <button
            onClick={() => onNavigate('monitor')}
            className="text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer text-left"
          >
            PulsePresence
          </button>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('monitor')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeSection === 'monitor' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Live Simulation
          </button>
          <button
            onClick={() => onNavigate('architecture')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeSection === 'architecture' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigate('probe')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeSection === 'probe' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Interactive Tester
          </button>
          <button
            onClick={() => onNavigate('platforms')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeSection === 'platforms' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            App Guide
          </button>
          <button
            onClick={() => onNavigate('telemetry')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              activeSection === 'telemetry' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Activity Stream
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm active:scale-95"
            title="Reset simulated peer connection parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Simulation</span>
          </button>
        </div>
      </div>
    </header>
  );
};
