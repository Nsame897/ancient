import React from 'react';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, Plus } from 'lucide-react';
import { CallRecord } from '../../types/chatnova';

interface CallsViewProps {
  calls: CallRecord[];
  onStartCall: (contactId: string, contactName: string, callType: 'voice' | 'video') => void;
}

export const CallsView: React.FC<CallsViewProps> = ({ calls, onStartCall }) => {
  const formatDuration = (sec: number) => {
    if (sec === 0) return 'Missed';
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E1E26]">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Call History</h2>
          <p className="text-xs text-slate-400">Encrypted P2P Voice and Video Call Records</p>
        </div>

        <button
          onClick={() => onStartCall('usr_elena', 'Elena Rostova', 'voice')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-violet-600/20 active:scale-95 transition-all cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>New Call</span>
        </button>
      </div>

      {/* Call Items */}
      <div className="space-y-2">
        {calls.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No call records yet. Start a simulated voice or video call with any contact.
          </div>
        ) : (
          calls.map((call) => {
            const isMissed = call.status === 'missed';

            return (
              <div
                key={call.id}
                className="flex items-center justify-between p-3.5 bg-[#0D0D12] border border-[#1E1E26] rounded-2xl hover:bg-[#14141B] transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={call.contactAvatar}
                    alt={call.contactName}
                    className="w-11 h-11 rounded-2xl object-cover border border-[#1E1E26] shrink-0"
                  />
                  <div>
                    <span
                      className={`text-sm font-semibold block ${
                        isMissed ? 'text-rose-400' : 'text-white'
                      }`}
                    >
                      {call.contactName}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      {call.status === 'missed' ? (
                        <PhoneMissed className="w-3.5 h-3.5 text-rose-400" />
                      ) : call.direction === 'incoming' ? (
                        <PhoneIncoming className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <PhoneOutgoing className="w-3.5 h-3.5 text-cyan-400" />
                      )}

                      <span>{call.timestamp}</span>
                      <span>·</span>
                      <span className="font-mono text-[11px]">
                        {formatDuration(call.durationSeconds)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Call-back Action Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onStartCall(call.contactId, call.contactName, 'voice')}
                    className="p-2.5 text-slate-400 hover:text-violet-400 hover:bg-[#1A1A24] rounded-xl transition-colors cursor-pointer"
                    title="Voice Call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onStartCall(call.contactId, call.contactName, 'video')}
                    className="p-2.5 text-slate-400 hover:text-cyan-400 hover:bg-[#1A1A24] rounded-xl transition-colors cursor-pointer"
                    title="Video Call"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
