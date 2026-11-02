import React, { useState } from 'react';
import { X, Send, BellOff, CheckCheck, Shield, Radio, Sparkles, Smartphone, VolumeX } from 'lucide-react';
import { PeerUser } from '../types/presence';

interface SendMessageModalProps {
  peer: PeerUser | null;
  onClose: () => void;
  onLogged: (msg: string) => void;
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({ peer, onClose, onLogged }) => {
  const [text, setText] = useState('Hey! Are you free for a quick question?');
  const [dispatched, setDispatched] = useState(false);

  if (!peer) return null;

  const isMuted = peer.notificationState !== 'enabled';
  const isOnline = peer.socketConnected && peer.appState !== 'closed';

  const handleSend = () => {
    setDispatched(true);
    onLogged(`Sent message to ${peer.name}: "${text}"`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Send Test Message to {peer.name}
              </h3>
              <p className="text-xs text-slate-400">
                Their device notifications are currently: <strong className="text-amber-300 uppercase">{peer.notificationState}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Type a Message to Transmit:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-cyan-500"
              disabled={dispatched}
            />
          </div>

          {dispatched ? (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Direct Internet Socket:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Delivered to screen ({peer.latencyMs}ms)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Phone Sound / Ringer:</span>
                  <span className={`font-semibold ${
                    isMuted ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {isMuted ? 'SILENT (No beep or buzz)' : 'RANG NORMALLY'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status in Your Chat:</span>
                  <span className="text-emerald-400 font-semibold">
                    {isOnline ? '🟢 ONLINE (Socket alive)' : '⚪ OFFLINE'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Delivery Receipts:</span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <CheckCheck className="w-4 h-4 text-cyan-400" />
                    Delivered & read
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-cyan-200 leading-relaxed">
                🎉 <strong>The Mystery Solved:</strong> This demonstrates why you can see someone online even if their sound or notifications are off! {peer.name} has the app open on their phone, so your message popped up right on their screen. Their silent switch prevented a notification sound, but they are still active.
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
              Click &ldquo;Send Message&rdquo; to test how modern messaging engines deliver data directly over the open connection while respecting the user&apos;s silent switch.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {!dispatched ? (
            <button
              onClick={handleSend}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
