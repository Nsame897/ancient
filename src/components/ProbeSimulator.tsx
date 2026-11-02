import React, { useState } from 'react';
import { Play, CheckCircle2, AlertTriangle, ShieldCheck, XCircle, Terminal, HelpCircle, Sparkles, Smartphone, RotateCcw } from 'lucide-react';
import { ProbeScenario, ProbeResult, PresenceVerdict, NotificationState, AppState, PrivacySetting } from '../types/presence';

export const ProbeSimulator: React.FC = () => {
  const [scenario, setScenario] = useState<ProbeScenario>({
    device: 'ios',
    notificationSetting: 'muted',
    appState: 'foreground',
    networkState: 'connected',
    privacyMode: 'public',
  });

  const [probing, setProbing] = useState<boolean>(false);
  const [result, setResult] = useState<ProbeResult | null>({
    verdict: 'online',
    confidence: 99,
    socketStatus: 'active',
    heartbeatSuccess: true,
    visibilityReported: 'visible',
    pushNotificationChannel: 'suppressed',
    technicalReasoning: [
      'App is actively open on the screen: WebSocket pipe is open.',
      'Heartbeat response received in 18ms.',
      'Phone notifications are MUTED: Audio/banners are silenced, but socket connection remains ONLINE.',
    ],
  });

  const presets = [
    {
      title: 'Phone on Silent, App Open',
      desc: 'The classic question: phone is muted, but user is looking at chat',
      scenario: {
        device: 'ios' as const,
        notificationSetting: 'muted' as const,
        appState: 'foreground' as const,
        networkState: 'connected' as const,
        privacyMode: 'public' as const,
      },
    },
    {
      title: 'Do Not Disturb, Tab Minimized',
      desc: 'Late-night work with DND enabled and browser minimized',
      scenario: {
        device: 'browser_tab' as const,
        notificationSetting: 'dnd' as const,
        appState: 'background' as const,
        networkState: 'connected' as const,
        privacyMode: 'public' as const,
      },
    },
    {
      title: 'Stealth Mode (Appear Offline)',
      desc: 'App open, but WhatsApp "Nobody" or Discord "Invisible" turned on',
      scenario: {
        device: 'desktop_app' as const,
        notificationSetting: 'muted' as const,
        appState: 'foreground' as const,
        networkState: 'connected' as const,
        privacyMode: 'stealth' as const,
      },
    },
    {
      title: 'Airplane Mode (No Signal)',
      desc: 'Device has lost internet connection completely',
      scenario: {
        device: 'android' as const,
        notificationSetting: 'enabled' as const,
        appState: 'foreground' as const,
        networkState: 'airplane' as const,
        privacyMode: 'public' as const,
      },
    },
  ];

  const runProbe = (customScenario?: ProbeScenario) => {
    const target = customScenario || scenario;
    setProbing(true);
    setResult(null);

    setTimeout(() => {
      let verdict: PresenceVerdict = 'online';
      let socketStatus: 'active' | 'degraded' | 'closed' = 'active';
      let heartbeatSuccess = true;
      let visibilityReported: 'visible' | 'hidden' | 'unknown' = 'visible';
      let pushChannel: 'delivering' | 'suppressed' | 'blocked' = 'delivering';
      const reasoning: string[] = [];

      if (target.networkState === 'airplane') {
        verdict = 'offline';
        socketStatus = 'closed';
        heartbeatSuccess = false;
        reasoning.push('Internet connection is offline. No signal reaches the presence server.');
        reasoning.push('Presence server marks user as OFFLINE.');
      } else if (target.appState === 'closed') {
        verdict = 'offline';
        socketStatus = 'closed';
        heartbeatSuccess = false;
        reasoning.push('Application was closed or swiped away. Operating system terminated the socket.');
        reasoning.push('Presence server marks user as OFFLINE.');
      } else if (target.privacyMode === 'stealth') {
        verdict = 'hidden';
        socketStatus = 'active';
        heartbeatSuccess = true;
        reasoning.push('The socket connection is 100% alive and sending heartbeats.');
        reasoning.push('However, because Stealth Mode is enabled, the server deliberately tells contacts they are OFFLINE.');
      } else if (target.appState === 'background') {
        verdict = 'away';
        socketStatus = 'active';
        heartbeatSuccess = true;
        visibilityReported = 'hidden';
        reasoning.push('Browser/app is minimized or in background.');
        reasoning.push('Server receives heartbeats but sets status to AWAY/IDLE.');
      } else {
        verdict = 'online';
        socketStatus = 'active';
        heartbeatSuccess = true;
        visibilityReported = 'visible';
        reasoning.push('App is open and active in foreground.');
        reasoning.push('Live WebSocket socket sends regular heartbeats (RTT < 20ms).');
      }

      if (target.notificationSetting === 'muted' || target.notificationSetting === 'dnd') {
        pushChannel = 'suppressed';
        reasoning.push(`Phone notifications are ${target.notificationSetting.toUpperCase()}: The device will not ring, but the presence connection is completely unaffected!`);
      } else if (target.notificationSetting === 'disabled') {
        pushChannel = 'blocked';
        reasoning.push('Operating system notifications are disabled. Alerts are blocked, but socket remains active.');
      } else {
        pushChannel = 'delivering';
        reasoning.push('Notifications are enabled: Sound and banners work normally.');
      }

      setResult({
        verdict,
        confidence: 99,
        socketStatus,
        heartbeatSuccess,
        visibilityReported,
        pushNotificationChannel: pushChannel,
        technicalReasoning: reasoning,
      });

      setProbing(false);
    }, 400);
  };

  const handleSelectPreset = (p: typeof presets[0]) => {
    setScenario(p.scenario);
    runProbe(p.scenario);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <span>INTERACTIVE TEST LAB</span>
            <span aria-hidden="true">·</span>
            <span>WHAT HAPPENS IF... ?</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Scenario Diagnostic Tester
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pick a quick preset or mix and match settings to see if someone is detected as Online
          </p>
        </div>

        <button
          onClick={() => runProbe()}
          disabled={probing}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-sm shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{probing ? 'Testing...' : 'Test This Setup'}</span>
        </button>
      </div>

      {/* 1-Click Quick Presets */}
      <div>
        <label className="text-xs font-bold text-slate-300 block mb-2">
          Try a Common Real-World Scenario:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-950 transition-all text-left cursor-pointer group"
            >
              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                {p.title}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {p.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Configuration Dropdowns */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
        <span className="text-xs font-bold text-slate-300 block">
          Or Customize the Details:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Param 1: Device */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Device
            </label>
            <select
              value={scenario.device}
              onChange={(e) => setScenario({ ...scenario, device: e.target.value as any })}
              className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ios">iPhone (iOS)</option>
              <option value="android">Android Phone</option>
              <option value="browser_tab">Chrome Browser Tab</option>
              <option value="desktop_app">Desktop App (Mac/PC)</option>
            </select>
          </div>

          {/* Param 2: Notification */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Phone Notification
            </label>
            <select
              value={scenario.notificationSetting}
              onChange={(e) => setScenario({ ...scenario, notificationSetting: e.target.value as any })}
              className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="muted">Muted / Silent Mode</option>
              <option value="dnd">Do Not Disturb (DND)</option>
              <option value="enabled">Notifications Enabled</option>
              <option value="disabled">System Alerts Off</option>
            </select>
          </div>

          {/* Param 3: App Lifecycle */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Is App Open?
            </label>
            <select
              value={scenario.appState}
              onChange={(e) => setScenario({ ...scenario, appState: e.target.value as any })}
              className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="foreground">Open on Screen (Active)</option>
              <option value="background">Minimized in Background</option>
              <option value="closed">Closed / Swiped Away</option>
            </select>
          </div>

          {/* Param 4: Network */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Internet Connection
            </label>
            <select
              value={scenario.networkState}
              onChange={(e) => setScenario({ ...scenario, networkState: e.target.value as any })}
              className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="connected">Connected (Wi-Fi or 5G)</option>
              <option value="airplane">Airplane Mode (Offline)</option>
            </select>
          </div>

          {/* Param 5: Privacy Setting */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Privacy Setting
            </label>
            <select
              value={scenario.privacyMode}
              onChange={(e) => setScenario({ ...scenario, privacyMode: e.target.value as any })}
              className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="public">Normal (Show Online)</option>
              <option value="contacts">Contacts Only</option>
              <option value="stealth">Stealth (Appear Offline)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Verdict:</span>
              <div className="flex items-center gap-3 mt-0.5">
                <span
                  className={`text-2xl font-black uppercase tracking-wide ${
                    result.verdict === 'online'
                      ? 'text-emerald-400'
                      : result.verdict === 'away'
                      ? 'text-amber-400'
                      : result.verdict === 'hidden'
                      ? 'text-purple-400'
                      : 'text-slate-500'
                  }`}
                >
                  {result.verdict === 'hidden' ? 'Appears Offline' : result.verdict}
                </span>
                <span
                  className={`w-3.5 h-3.5 rounded-full ${
                    result.verdict === 'online'
                      ? 'bg-emerald-400 ring-4 ring-emerald-500/20'
                      : result.verdict === 'away'
                      ? 'bg-amber-400 ring-4 ring-amber-500/20'
                      : result.verdict === 'hidden'
                      ? 'bg-purple-400 ring-4 ring-purple-500/20'
                      : 'bg-slate-600'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Live Socket:</span>
                <strong className={result.socketStatus === 'active' ? 'text-emerald-400' : 'text-slate-500'}>
                  {result.socketStatus.toUpperCase()}
                </strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Alert Sounds:</span>
                <strong className={result.pushNotificationChannel === 'suppressed' ? 'text-amber-400' : 'text-slate-300'}>
                  {result.pushNotificationChannel === 'suppressed' ? 'MUTED' : 'ENABLED'}
                </strong>
              </div>
            </div>
          </div>

          {/* Simple Explanation */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">
              Why this happens:
            </span>
            <div className="space-y-2">
              {result.technicalReasoning.map((reason, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
