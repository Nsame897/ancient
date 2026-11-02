import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, CheckCheck, Clock, UserX, KeyRound, Sparkles, X, Check } from 'lucide-react';
import { PrivacySettings, DisappearingDuration } from '../../types/chatnova';

interface PrivacySettingsModalProps {
  settings: PrivacySettings;
  onUpdate: (updated: Partial<PrivacySettings>) => void;
  onClose: () => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  settings,
  onUpdate,
  onClose,
}) => {
  const [pinInput, setPinInput] = useState(settings.appLockPin || '');
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSavePin = () => {
    if (pinInput.length === 4) {
      onUpdate({ appLockPin: pinInput });
      setShowPinSetup(false);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    }
  };

  const handleRemovePin = () => {
    onUpdate({ appLockPin: null });
    setPinInput('');
    setShowPinSetup(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg max-h-[90vh] bg-[#0D0D12] border border-[#1E1E26] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E26] bg-[#070709]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Advanced Privacy & Stealth</h3>
              <p className="text-[11px] text-slate-400">Total sovereignty over your online metadata</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {savedNotice && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/40 rounded-xl text-emerald-300 flex items-center gap-2 font-medium">
              <Check className="w-4 h-4" />
              <span>Privacy settings updated securely.</span>
            </div>
          )}

          {/* Section 1: Online Status & Last Seen */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400">
              Online Status & Activity Cloak
            </h4>

            {/* Toggle 1: Hide Online Status */}
            <div className="flex items-center justify-between p-3.5 bg-[#14141B] rounded-2xl border border-[#1E1E26]">
              <div className="space-y-0.5 max-w-[80%]">
                <span className="font-semibold text-white block">Hide Online Status (Stealth Mode)</span>
                <p className="text-[11px] text-slate-400">
                  When enabled, other users cannot see when you have ChatNova open on your screen.
                </p>
              </div>
              <button
                onClick={() => onUpdate({ hideOnlineStatus: !settings.hideOnlineStatus })}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  settings.hideOnlineStatus ? 'bg-violet-600' : 'bg-[#2A2A38]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.hideOnlineStatus ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Selector: Last Seen Visibility */}
            <div className="p-3.5 bg-[#14141B] rounded-2xl border border-[#1E1E26] space-y-2">
              <span className="font-semibold text-white block">Who Can See My Last Seen:</span>
              <div className="grid grid-cols-3 gap-2">
                {(['everyone', 'contacts', 'nobody'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => onUpdate({ lastSeenVisibility: opt })}
                    className={`py-1.5 rounded-xl capitalize font-medium transition-colors ${
                      settings.lastSeenVisibility === opt
                        ? 'bg-violet-600 text-white font-bold'
                        : 'bg-[#1C1C26] text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Messaging Telemetry */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Messaging Metadata & Receipts
            </h4>

            {/* Toggle: Read Receipts */}
            <div className="flex items-center justify-between p-3.5 bg-[#14141B] rounded-2xl border border-[#1E1E26]">
              <div className="space-y-0.5 max-w-[80%]">
                <span className="font-semibold text-white block">Read Receipts (Blue Ticks)</span>
                <p className="text-[11px] text-slate-400">
                  If disabled, others won&apos;t see when you read their messages.
                </p>
              </div>
              <button
                onClick={() => onUpdate({ readReceiptsEnabled: !settings.readReceiptsEnabled })}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  settings.readReceiptsEnabled ? 'bg-cyan-600' : 'bg-[#2A2A38]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.readReceiptsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle: Typing Cloak */}
            <div className="flex items-center justify-between p-3.5 bg-[#14141B] rounded-2xl border border-[#1E1E26]">
              <div className="space-y-0.5 max-w-[80%]">
                <span className="font-semibold text-white block">Cloak Typing Indicators</span>
                <p className="text-[11px] text-slate-400">
                  Prevents the &ldquo;typing...&rdquo; status from broadcasting while you compose.
                </p>
              </div>
              <button
                onClick={() => onUpdate({ typingIndicatorEnabled: !settings.typingIndicatorEnabled })}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  !settings.typingIndicatorEnabled ? 'bg-violet-600' : 'bg-[#2A2A38]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    !settings.typingIndicatorEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Default Disappearing Timer */}
            <div className="p-3.5 bg-[#14141B] rounded-2xl border border-[#1E1E26] space-y-2">
              <span className="font-semibold text-white block">Default Disappearing Timer for New Chats:</span>
              <div className="grid grid-cols-4 gap-2">
                {(['off', '24h', '7d', '90d'] as DisappearingDuration[]).map((dur) => (
                  <button
                    key={dur}
                    onClick={() => onUpdate({ disappearingDefault: dur })}
                    className={`py-1.5 rounded-xl font-mono uppercase transition-colors ${
                      settings.disappearingDefault === dur
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'bg-[#1C1C26] text-slate-400 hover:text-white'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: App Lock with PIN */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Biometrics & App Lock
            </h4>

            <div className="p-4 bg-[#14141B] rounded-2xl border border-[#1E1E26] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Require PIN to Open ChatNova</span>
                  <span className="text-[11px] text-slate-400">
                    {settings.appLockPin ? '🔒 App Lock Active (4-digit PIN)' : 'Unlocked'}
                  </span>
                </div>
                <button
                  onClick={() => setShowPinSetup(!showPinSetup)}
                  className="px-3 py-1.5 bg-[#1E1E28] text-amber-300 rounded-xl font-semibold border border-amber-500/20 hover:bg-[#2A2A38]"
                >
                  {settings.appLockPin ? 'Change PIN' : 'Set PIN'}
                </button>
              </div>

              {showPinSetup && (
                <div className="pt-3 border-t border-[#22222E] space-y-3">
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 4-digit PIN"
                    className="w-full bg-[#070709] border border-[#2A2A38] rounded-xl px-3.5 py-2 text-center text-lg tracking-widest text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex justify-end gap-2">
                    {settings.appLockPin && (
                      <button
                        onClick={handleRemovePin}
                        className="px-3 py-1.5 text-rose-400 hover:text-rose-300"
                      >
                        Remove PIN
                      </button>
                    )}
                    <button
                      onClick={handleSavePin}
                      disabled={pinInput.length !== 4}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl"
                    >
                      Save PIN
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#070709] border-t border-[#1E1E26] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
