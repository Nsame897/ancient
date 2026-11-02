import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Eye, EyeOff, Wifi, WifiOff, Bell, BellOff, Shield, Activity, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { NotificationState, PrivacySetting, PresenceVerdict } from '../types/presence';

interface LocalPresenceCardProps {
  onLogEvent: (type: string, message: string, status: PresenceVerdict) => void;
}

export const LocalPresenceCard: React.FC<LocalPresenceCardProps> = ({ onLogEvent }) => {
  const [isVisible, setIsVisible] = useState(!document.hidden);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [idleSeconds, setIdleSeconds] = useState(0);
  const [notificationSetting, setNotificationSetting] = useState<NotificationState>('muted');
  const [privacySetting, setPrivacySetting] = useState<PrivacySetting>('public');
  const [heartbeatCounter, setHeartbeatCounter] = useState(1);
  const [lastPingLatency, setLastPingLatency] = useState(14);
  const lastActiveRef = useRef<number>(Date.now());

  // 1. Listen to real Page Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsVisible(visible);
      const verdict = computeVerdict(visible, isOnline, idleSeconds, privacySetting);
      onLogEvent(
        'VISIBILITY_CHANGE',
        `Your browser tab was ${visible ? 'brought to FOREGROUND (Active)' : 'MINIMIZED or placed in BACKGROUND'}.`,
        verdict
      );
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isOnline, idleSeconds, privacySetting, onLogEvent]);

  // 2. Listen to real Network Online/Offline
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      onLogEvent('SOCKET_EVENT', 'Internet reconnected. Presence restored to Online.', 'online');
    };
    const handleOffline = () => {
      setIsOnline(false);
      onLogEvent('SOCKET_EVENT', 'Internet disconnected. Presence dropped to Offline.', 'offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onLogEvent]);

  // 3. User activity & idle tracking
  useEffect(() => {
    const resetActivity = () => {
      lastActiveRef.current = Date.now();
      setIdleSeconds(0);
    };

    window.addEventListener('mousemove', resetActivity, { passive: true });
    window.addEventListener('keydown', resetActivity, { passive: true });
    window.addEventListener('click', resetActivity, { passive: true });
    window.addEventListener('scroll', resetActivity, { passive: true });
    window.addEventListener('touchstart', resetActivity, { passive: true });

    const idleInterval = setInterval(() => {
      const secondsPassed = Math.floor((Date.now() - lastActiveRef.current) / 1000);
      setIdleSeconds(secondsPassed);
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', resetActivity);
      window.removeEventListener('keydown', resetActivity);
      window.removeEventListener('click', resetActivity);
      window.removeEventListener('scroll', resetActivity);
      window.removeEventListener('touchstart', resetActivity);
      clearInterval(idleInterval);
    };
  }, []);

  // 4. Heartbeat loop (simulating client-server keepalive)
  useEffect(() => {
    const heartbeatTimer = setInterval(() => {
      if (!isOnline) return;
      setHeartbeatCounter((prev) => prev + 1);
      const jitter = Math.floor(10 + Math.random() * 8);
      setLastPingLatency(jitter);
    }, 3000);

    return () => clearInterval(heartbeatTimer);
  }, [isOnline]);

  const computeVerdict = (
    visible: boolean,
    online: boolean,
    idle: number,
    privacy: PrivacySetting
  ): PresenceVerdict => {
    if (!online) return 'offline';
    if (privacy === 'stealth') return 'hidden';
    if (!visible) return 'away';
    if (idle >= 25) return 'away';
    return 'online';
  };

  const currentVerdict = computeVerdict(isVisible, isOnline, idleSeconds, privacySetting);

  const handleToggleNotifications = (newVal: NotificationState) => {
    setNotificationSetting(newVal);
    onLogEvent(
      'NOTIFICATION_TOGGLE',
      `You changed your notification mode to: ${newVal.toUpperCase()}. Note: Your green Online status did NOT change!`,
      currentVerdict
    );
  };

  const handleTogglePrivacy = (newVal: PrivacySetting) => {
    setPrivacySetting(newVal);
    const updated = computeVerdict(isVisible, isOnline, idleSeconds, newVal);
    onLogEvent(
      'PRIVACY_CHANGE',
      `Privacy mode changed to: ${newVal === 'stealth' ? 'APPEAR OFFLINE (Stealth)' : 'PUBLIC'}`,
      updated
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center shrink-0">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Your Browser Tab (Live Sensor)</h2>
              <span className="text-xs text-cyan-400 font-medium">Interactive Demo</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Testing how your actual browser behaves with notifications silenced vs stealth mode
            </p>
          </div>
        </div>

        {/* Big Verdict Pill */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 shrink-0">
          <div className="flex flex-col text-right">
            <span className="text-[11px] text-slate-400 font-medium">What other users see:</span>
            <span
              className={`text-sm font-bold uppercase tracking-wide ${
                currentVerdict === 'online'
                  ? 'text-emerald-400'
                  : currentVerdict === 'away'
                  ? 'text-amber-400'
                  : currentVerdict === 'hidden'
                  ? 'text-purple-400'
                  : 'text-slate-500'
              }`}
            >
              {currentVerdict === 'hidden' ? 'Appears Offline' : currentVerdict}
            </span>
          </div>
          <span
            className={`w-3.5 h-3.5 rounded-full ${
              currentVerdict === 'online'
                ? 'bg-emerald-400 ring-4 ring-emerald-500/20'
                : currentVerdict === 'away'
                ? 'bg-amber-400 ring-4 ring-amber-500/20'
                : currentVerdict === 'hidden'
                ? 'bg-purple-400 ring-4 ring-purple-500/20'
                : 'bg-slate-600'
            }`}
          />
        </div>
      </div>

      {/* Real-time Browser Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 border-b border-slate-800/80">
        {/* Metric 1 */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Tab Visibility</span>
            {isVisible ? (
              <Eye className="w-4 h-4 text-cyan-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="text-sm font-bold text-white">
            {isVisible ? 'Looking at this tab' : 'Tab minimized / hidden'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isVisible ? 'Active in foreground' : 'Switched away'}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Internet Connection</span>
            {isOnline ? (
              <Wifi className="w-4 h-4 text-emerald-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className="text-sm font-bold text-white">
            {isOnline ? 'Connected' : 'Offline'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono tabular-nums">
            {isOnline ? `${lastPingLatency}ms latency` : 'No connection'}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Mouse / Keyboard</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono tabular-nums">
            {idleSeconds === 0 ? 'Active just now' : `${idleSeconds}s since move`}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {idleSeconds >= 25 ? 'Auto-marked Away (>25s)' : 'Moving mouse resets timer'}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Heartbeat Packets</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono tabular-nums">
            #{heartbeatCounter} sent
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Automatic 3s ping
          </div>
        </div>
      </div>

      {/* Interactive Experiment Controls with Plain English Explanations */}
      <div className="pt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Control 1: Notification Mode */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              Experiment 1: Change Your Notification Setting
            </label>
            <span className="text-[11px] text-slate-500 font-medium">Audio & Alerts</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['enabled', 'muted', 'dnd'] as NotificationState[]).map((mode) => (
              <button
                key={mode}
                onClick={() => handleToggleNotifications(mode)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer text-center ${
                  notificationSetting === mode
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {mode === 'enabled' ? 'Alerts ON' : mode === 'muted' ? 'Muted / Silent' : 'Do Not Disturb'}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Key Insight:</strong>
              {notificationSetting !== 'enabled' ? (
                <span>
                  You selected <strong>{notificationSetting === 'muted' ? 'Muted / Silent' : 'Do Not Disturb'}</strong>. Notice your status above is still <strong className="text-emerald-400 font-semibold">ONLINE</strong>! Turning off sound does not disconnect your browser socket.
                </span>
              ) : (
                <span>Standard notifications. Incoming messages will ring and your presence remains Online.</span>
              )}
            </div>
          </div>
        </div>

        {/* Control 2: Privacy / Stealth Setting */}
        <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              Experiment 2: App Privacy (How to Genuinely Hide)
            </label>
            <span className="text-[11px] text-slate-500 font-medium">Server Policy</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleTogglePrivacy('public')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer text-center ${
                privacySetting === 'public'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Broadcast Online (Standard)
            </button>
            <button
              onClick={() => handleTogglePrivacy('stealth')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer text-center ${
                privacySetting === 'stealth'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Stealth (Appear Offline)
            </button>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">How real privacy works:</strong>
              {privacySetting === 'stealth' ? (
                <span className="text-purple-200">
                  Stealth mode active! The server knows you are connected, but tells everyone else you are <strong>Offline</strong>. This is how WhatsApp &ldquo;Nobody&rdquo; and Discord &ldquo;Invisible&rdquo; work.
                </span>
              ) : (
                <span>Your status is visible to contacts because standard broadcasting is turned on.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
