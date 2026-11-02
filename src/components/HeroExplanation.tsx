import React, { useState, useEffect } from 'react';
import { VolumeX, Radio, ShieldCheck, HelpCircle, Check, ArrowRight, Sparkles } from 'lucide-react';

export const HeroExplanation: React.FC = () => {
  const [tabSwitchedNotice, setTabSwitchedNotice] = useState(false);
  const [switchCount, setSwitchCount] = useState(0);

  useEffect(() => {
    const handleVis = () => {
      if (document.hidden) {
        setSwitchCount((c) => c + 1);
      } else {
        setTabSwitchedNotice(true);
        const timer = setTimeout(() => setTabSwitchedNotice(false), 5000);
        return () => clearTimeout(timer);
      }
    };
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, []);

  return (
    <section className="border-b border-slate-800/80 bg-gradient-to-b from-slate-900/50 via-slate-950/70 to-slate-950 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Headline & Simple Explanation */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-3 tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE EXPLAINER & SIMULATION</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 text-balance">
            Can an app detect someone is online even when their notifications are off?
          </h1>

          <p className="text-lg font-medium text-cyan-200/90 mb-3">
            Yes, absolutely. Here is why in 10 seconds:
          </p>

          <p className="text-base text-slate-300 leading-relaxed">
            Turning notifications off only silences the <strong>sound and banner popups</strong> on your phone. 
            It does <em>not</em> disconnect you from the internet or close your app. The instant you have an app open on your screen, your device speaks directly to the server every few seconds—letting the system and your friends know you are <strong>Online</strong>.
          </p>
        </div>

        {/* The Simple Everyday Metaphor Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/20 border border-cyan-900/40 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                The Simple Living Room Metaphor
              </span>
              <h2 className="text-lg font-semibold text-white">
                Think of notifications as the doorbell, and online status as being at home.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                If you put on noise-canceling headphones inside your living room, you won&apos;t hear when someone rings your doorbell (notifications muted). 
                However, if someone looks through your front window, they can clearly see you sitting on the couch (you are still online).
              </p>
            </div>

            {/* Quick Live Tab Test Reminder */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2 shrink-0 md:w-72">
              <div className="font-semibold text-white flex items-center justify-between">
                <span>Try it yourself right now:</span>
                <span className="text-cyan-400 font-mono text-[11px]">{switchCount > 0 ? `${switchCount} tests` : 'Ready'}</span>
              </div>
              <p className="text-slate-400 text-[11.5px] leading-relaxed">
                Switch to another browser tab for 3 seconds, then return here. Watch how our live sensor detects your departure and return instantly!
              </p>
              {tabSwitchedNotice && (
                <div className="p-2 bg-emerald-950/60 border border-emerald-800/60 rounded-md text-emerald-300 font-medium text-[11px] flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Sensor verified: You returned to this tab!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3 Friendly Core Takeaways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <VolumeX className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">
              Notifications = Audio & Banners
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Handled locally by iOS (Apple APNs) or Android (Google FCM). It simply tells the phone: &ldquo;Don&apos;t vibrate or light up the screen right now.&rdquo;
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">
              Online Status = Open Data Cable
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              When an app is open, it maintains an active WebSocket heartbeat pinging the server every 3–15 seconds. If the server receives a ping, it marks you Online.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">
              How to Truly Appear Offline
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              To actually hide, you must either swipe the app closed (disconnecting the socket) or use built-in privacy settings (like WhatsApp&apos;s &ldquo;Nobody&rdquo; or Discord&apos;s &ldquo;Invisible&rdquo;).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
