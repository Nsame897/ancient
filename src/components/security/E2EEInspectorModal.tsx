import React from 'react';
import { Lock, ShieldCheck, Key, RefreshCw, X, Check, ShieldAlert, Cpu } from 'lucide-react';
import { Conversation, User } from '../../types/chatnova';

interface E2EEInspectorModalProps {
  conversation: Conversation;
  currentUser: User;
  onClose: () => void;
}

export const E2EEInspectorModal: React.FC<E2EEInspectorModalProps> = ({
  conversation,
  currentUser,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0D0D12] border border-[#1E1E26] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E26] bg-[#070709]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">E2EE Cryptographic Verification</h3>
              <p className="text-[11px] text-slate-400">Double Ratchet Protocol & Session Key State</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          {/* Status Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <Lock className="w-4 h-4" />
              <span>Zero-Knowledge Encryption Active</span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-slate-300">
              Messages and attachments between you and <strong className="text-white">{conversation.name}</strong> are encrypted directly on your device before transmission. Only participating endpoints possess the private keys to decrypt.
            </p>
          </div>

          {/* Session Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400">
              Session Cipher Parameters
            </h4>

            <div className="bg-[#14141B] rounded-2xl p-4 border border-[#1E1E26] space-y-2.5 font-mono text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Cipher Suite:</span>
                <span className="text-white font-semibold">X25519-AES-256-GCM-SHA256</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ratchet Key ID:</span>
                <span className="text-cyan-400 font-semibold">{conversation.encryptionKeyId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Forward Secrecy:</span>
                <span className="text-emerald-400 font-semibold">Enabled (Continuous Ratchet)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Disappearing Messages:</span>
                <span className="text-amber-400 font-semibold">{conversation.disappearingDuration.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Security Code Fingerprint */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Public Key Fingerprint
            </h4>
            <div className="p-3 bg-[#070709] rounded-xl border border-[#1E1E26] text-center font-mono text-xs text-slate-200 tracking-wider">
              {currentUser.publicKeyFingerprint}
            </div>
            <p className="text-[11px] text-slate-500 text-center">
              Compare this fingerprint with your contact to verify you are communicating without a man-in-the-middle.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#070709] border-t border-[#1E1E26] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
