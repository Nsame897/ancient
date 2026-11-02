import React, { useState } from 'react';
import { Network, Server, Smartphone, BellOff, Radio, ArrowRight, Zap, Info, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

export const ArchitectureFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSimulatingPacket, setIsSimulatingPacket] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'friendly' | 'technical'>('friendly');

  const steps = [
    {
      num: 1,
      title: '1. User Opens App with Phone Silenced',
      friendlyDesc: 'Elena picks up her phone and opens WhatsApp, Slack, or Teams. Her phone switch is on Silent or Do Not Disturb.',
      techDesc: 'Client process launched in foreground OS window. Thread initializes TCP socket and TLS handshake to presence endpoint (wss://presence.app.com).',
      highlight: 'Phone Ringer: SILENT · Internet: CONNECTED',
    },
    {
      num: 2,
      title: '2. Device Opens a Live Data Cable',
      friendlyDesc: 'Because the app is open on the screen, it opens an invisible two-way internet connection (a WebSocket) to the app company’s servers.',
      techDesc: 'WebSocket protocol upgrade (HTTP 101 Switching Protocols). Keep-alive ping interval scheduled every 5,000ms with TCP_NODELAY.',
      highlight: 'Connection: 101 WebSocket Established',
    },
    {
      num: 3,
      title: '3. Periodic "I Am Alive" Heartbeats',
      friendlyDesc: 'Every 5 seconds, the app whispers to the server: "I am still looking at the screen." The server marks Elena as active in its database.',
      techDesc: 'Client emits 16-byte ping frame with client_seq and visibilityState: visible. Redis presence cluster runs EXPIRE presence:user:88 15.',
      highlight: 'Heartbeat: 200 OK Ping received',
    },
    {
      num: 4,
      title: '4. Friends See the Green "Online" Dot',
      friendlyDesc: 'When you open Elena’s chat, the server sees her recent heartbeat and lights up the green Online dot—completely ignoring her silent phone switch!',
      techDesc: 'Contact presence query returns is_active: true (last_seen_delta < 15s). Online badge rendered in UI.',
      highlight: 'Verdict: ONLINE (100% Confirmed)',
    },
  ];

  const handleRunSimulation = () => {
    setIsSimulatingPacket(true);
    let current = 1;
    const interval = setInterval(() => {
      current += 1;
      if (current > 4) {
        clearInterval(interval);
        setIsSimulatingPacket(false);
      } else {
        setActiveStep(current);
      }
    }, 1200);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <span>VISUAL EXPLAINER</span>
            <span aria-hidden="true">·</span>
            <span>TWO INDEPENDENT PIPELINES</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            How Presence Works When Notifications Are Off
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            See the exact difference between the Alert Channel and the Connection Channel
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Mode Switch */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('friendly')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'friendly' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Plain English
            </button>
            <button
              onClick={() => setViewMode('technical')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'technical' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Technical Specs
            </button>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulatingPacket}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isSimulatingPacket ? 'Playing...' : 'Animate Lifecycle'}</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Visual Pipelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pipeline 1: Push Notifications */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <BellOff className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Channel 1: Notifications & Alerts</h3>
                <p className="text-[11px] text-slate-400">Controlled by phone volume / DND</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
              MUTED
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start gap-3">
              <Server className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">1. Message arrives at server</strong>
                <p className="text-slate-400 mt-0.5">App server creates an alert request for Apple (APNs) or Google (FCM).</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start gap-3">
              <Smartphone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">2. Phone operating system checks settings</strong>
                <p className="text-slate-400 mt-0.5">Your phone sees &ldquo;Silent Mode / Do Not Disturb&rdquo; is on. It blocks the ringtone and lockscreen banner.</p>
              </div>
            </div>

            <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-amber-200">
              <strong>Result:</strong> Your phone makes zero sound. You are not bothered.
            </div>
          </div>
        </div>

        {/* Pipeline 2: Live Presence */}
        <div className="bg-slate-950/70 border border-cyan-900/40 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Channel 2: Live Presence</h3>
                <p className="text-[11px] text-slate-400">Controlled by whether app is open on screen</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
              ONLINE
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start gap-3">
              <Smartphone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">1. Screen is turned on and app is open</strong>
                <p className="text-slate-400 mt-0.5">The app holds open a direct internet socket pipe to the server.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start gap-3">
              <Network className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">2. Heartbeat pings pulse every 5 seconds</strong>
                <p className="text-slate-400 mt-0.5">The app regularly pings the server to keep the session alive.</p>
              </div>
            </div>

            <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-cyan-200">
              <strong>Result:</strong> Server marks you <strong className="text-emerald-400">ONLINE</strong> because your internet pipe is open.
            </div>
          </div>
        </div>
      </div>

      {/* Step by Step Breakdown */}
      <div className="pt-4 border-t border-slate-800/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Click any step to inspect what happens:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`p-3.5 rounded-xl text-left transition-all cursor-pointer ${
                activeStep === s.num
                  ? 'bg-slate-800 border border-cyan-500/50 shadow-md ring-1 ring-cyan-500/20'
                  : 'bg-slate-950/50 border border-slate-800/70 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${activeStep === s.num ? 'text-cyan-400' : 'text-slate-500'}`}>
                  Step 0{s.num}
                </span>
                {activeStep === s.num && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </div>
              <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                {s.title.split('. ')[1]}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {viewMode === 'friendly' ? s.friendlyDesc : s.techDesc}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Step Detail Box */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="font-bold text-white text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              {steps[activeStep - 1].title}
            </span>
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
              {steps[activeStep - 1].highlight}
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[12.5px]">
            {viewMode === 'friendly' ? steps[activeStep - 1].friendlyDesc : steps[activeStep - 1].techDesc}
          </p>
        </div>
      </div>

      {/* Helpful FAQ / Myth Busters */}
      <div className="pt-2 border-t border-slate-800/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          Common Questions & Realities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-white block font-semibold">Q: If I swipe the app closed, do I go offline immediately?</strong>
            <p className="text-slate-400 leading-relaxed">
              Almost immediately. If you have a clean internet connection, closing the app sends a &ldquo;disconnect&rdquo; packet. If you simply lose signal, the server waits 15 to 30 seconds before timing out your status to Offline.
            </p>
          </div>

          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 space-y-1">
            <strong className="text-white block font-semibold">Q: Can an app secretly track people who aren&apos;t my friends?</strong>
            <p className="text-slate-400 leading-relaxed">
              No. Major apps like WhatsApp, Signal, and Discord require either mutual phone contacts or shared servers/channels. Third-party scraping tools are blocked by aggressive platform security and rate limiting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
