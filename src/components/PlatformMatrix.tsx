import React, { useState } from 'react';
import { Shield, ShieldAlert, CheckCircle2, XCircle, Info, ExternalLink, Smartphone, MessageSquare } from 'lucide-react';

interface PlatformInfo {
  name: string;
  category: string;
  tagline: string;
  notificationBehavior: string;
  onlineDetectionMechanics: string;
  howToGenuinelyHide: string;
  stalkerwareResistance: string;
}

export const PlatformMatrix: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('whatsapp');

  const platforms: Record<string, PlatformInfo> = {
    whatsapp: {
      name: 'WhatsApp',
      category: 'Messaging',
      tagline: 'Most common place people notice this behavior',
      notificationBehavior: 'Muting a chat or turning off phone notifications only stops your phone from vibrating or ringing when messages arrive.',
      onlineDetectionMechanics: 'When you open WhatsApp on your phone screen, your app connects to the servers. Anyone viewing your chat will see the word "Online" directly under your name in real time, even if you put your phone on total silent.',
      howToGenuinelyHide: 'Open WhatsApp → Settings → Privacy → Last Seen & Online → Set "Who can see when I\'m online" to "Same as last seen", and set "Last Seen" to "Nobody".',
      stalkerwareResistance: 'WhatsApp added strict rate-limiting and phone number privacy settings so third-party tracker apps cannot secretly harvest your status without permission.',
    },
    slack: {
      name: 'Slack',
      category: 'Workplace',
      tagline: 'Green active dot vs "Zzz" snoozed icon',
      notificationBehavior: 'Pausing notifications or enabling Do Not Disturb displays a "Zzz" snooze icon next to your name to tell coworkers you might not reply right away.',
      onlineDetectionMechanics: 'However, the green presence dot is purely controlled by your mouse, keyboard, and window focus. If you are typing inside Slack with notifications paused, your green dot stays fully lit!',
      howToGenuinelyHide: 'Click your profile picture in Slack → Choose "Set yourself as away". Slack will display a hollow gray circle regardless of what you are doing.',
      stalkerwareResistance: 'Slack only shares presence with coworkers inside your verified company workspace.',
    },
    discord: {
      name: 'Discord',
      category: 'Gaming & Communities',
      tagline: 'Online, Idle, Do Not Disturb, and Invisible',
      notificationBehavior: 'Muting a server or setting your status to "Do Not Disturb" (red minus icon) stops desktop popups and sound alerts.',
      onlineDetectionMechanics: 'The "Do Not Disturb" circle still tells all your friends and server members that you are ONLINE—it just tells them you have alerts muted.',
      howToGenuinelyHide: 'Click your avatar at the bottom left → Choose "Invisible". You will look completely offline with a gray circle to everyone, while retaining full access to read and write messages.',
      stalkerwareResistance: 'Discord bots require explicit Privileged Gateway Intents to receive presence updates across servers.',
    },
    telegram: {
      name: 'Telegram',
      category: 'Cloud Chat',
      tagline: 'Approximate timestamps and stealth settings',
      notificationBehavior: 'Muting chats silences push notifications. Telegram maintains a persistent cloud connection (MTProto).',
      onlineDetectionMechanics: 'Whenever you open Telegram, anyone looking at your chat sees "Online". When you start typing, a "typing..." indicator is sent immediately.',
      howToGenuinelyHide: 'Settings → Privacy and Security → Last Seen & Online → Select "Nobody" or "My Contacts". Telegram replaces exact times with vague indicators like "last seen recently".',
      stalkerwareResistance: 'Telegram masks IP addresses in calls and prevents bulk harvesting of user presence.',
    },
    signal: {
      name: 'Signal',
      category: 'Private Messaging',
      tagline: 'Zero-presence privacy by design',
      notificationBehavior: 'End-to-end encrypted push notifications with sealed sender.',
      onlineDetectionMechanics: 'Signal intentionally DOES NOT broadcast an active "Online" banner or live status indicator. The Signal servers have zero awareness of when you are looking at the app.',
      howToGenuinelyHide: 'Signal already protects you by default. You can also turn off Read Receipts and Typing Indicators under Settings → Privacy.',
      stalkerwareResistance: 'Impossible to scrape or track because presence telemetry is simply not collected or broadcasted.',
    },
    instagram: {
      name: 'Instagram (Direct)',
      category: 'Social Media',
      tagline: 'Activity Status green dot in Direct Messages',
      notificationBehavior: 'Turning off Direct message push notifications prevents screen banners, but does not hide activity.',
      onlineDetectionMechanics: 'When you open Instagram, a green dot appears next to your profile in Direct messages, along with text like "Active now" or "Active 15m ago".',
      howToGenuinelyHide: 'Open Instagram → Profile → Menu (top right) → Settings and Privacy → Messages and story replies → Show activity status → Toggle OFF.',
      stalkerwareResistance: 'Only mutual accounts you have messaged or follow can view your activity status.',
    },
  };

  const current = platforms[selectedPlatform];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <span>APP-BY-APP DIRECTORY</span>
            <span aria-hidden="true">·</span>
            <span>REAL-WORLD SETTINGS</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Popular Apps & How They Handle Online Presence
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Click any app to see how notifications differ from presence and how to genuinely hide your status
          </p>
        </div>

        {/* Platform Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
          {Object.keys(platforms).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedPlatform(key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedPlatform === key
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {platforms[key].name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected App Detailed Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: What Happens */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wide">
              {current.category} · {current.tagline}
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              {current.name}: Notifications vs Online Status
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <strong className="text-slate-200 block mb-1 font-semibold">
                🔕 When You Turn Notifications Off:
              </strong>
              <p className="text-slate-400 leading-relaxed">{current.notificationBehavior}</p>
            </div>

            <div className="p-3.5 bg-cyan-950/20 border border-cyan-800/40 rounded-xl">
              <strong className="text-emerald-400 block mb-1 font-semibold">
                🟢 What Others See When You Open the App:
              </strong>
              <p className="text-slate-300 leading-relaxed">{current.onlineDetectionMechanics}</p>
            </div>
          </div>
        </div>

        {/* Right Column: How to Hide & Safety */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wide">
              Privacy Settings
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              How to Genuinely Turn Off Your Online Status
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-purple-950/30 border border-purple-800/40 rounded-xl">
              <strong className="text-purple-300 block mb-1 font-semibold">
                🛡️ Step-by-Step Instructions:
              </strong>
              <p className="text-slate-200 leading-relaxed">{current.howToGenuinelyHide}</p>
            </div>

            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <strong className="text-slate-300 block mb-1 font-semibold">
                🔒 Protection Against Third-Party Scrapers:
              </strong>
              <p className="text-slate-400 leading-relaxed">{current.stalkerwareResistance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Anti-Stalking Warning */}
      <div className="p-4 rounded-xl bg-slate-950 border border-amber-900/40 text-xs text-slate-300 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white block font-semibold">
            Warning Regarding &ldquo;Online Tracker&rdquo; Apps & APKs:
          </strong>
          <p className="text-slate-400 leading-relaxed">
            Be wary of third-party websites or downloadable APKs claiming they can &ldquo;secretly monitor when someone is online on WhatsApp without them knowing.&rdquo; Most of these are scams, malware, or violate international privacy laws (GDPR/CCPA). Modern platforms actively ban accounts and IP addresses that attempt unauthorized scraping.
          </p>
        </div>
      </div>
    </div>
  );
};
