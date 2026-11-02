import React, { useState } from 'react';
import { Users, Megaphone, Hash, Plus, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import { Community } from '../../types/chatnova';

interface CommunitiesViewProps {
  communities: Community[];
  onSelectChannel: (channelName: string) => void;
  onCreateCommunity: () => void;
}

export const CommunitiesView: React.FC<CommunitiesViewProps> = ({
  communities,
  onSelectChannel,
  onCreateCommunity,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E1E26]">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Communities Hub</h2>
          <p className="text-xs text-slate-400">Join topic-based groups and official announcement channels</p>
        </div>

        <button
          onClick={onCreateCommunity}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14141B] hover:bg-[#1E1E28] text-violet-300 border border-violet-800/40 text-xs font-semibold rounded-xl transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Community</span>
        </button>
      </div>

      {/* Community Cards */}
      <div className="space-y-4">
        {communities.map((comm) => (
          <div
            key={comm.id}
            className="bg-[#0D0D12] border border-[#1E1E26] rounded-3xl p-5 space-y-4 shadow-sm"
          >
            {/* Community Header */}
            <div className="flex items-start gap-3.5">
              <img
                src={comm.avatarUrl}
                alt={comm.name}
                className="w-13 h-13 rounded-2xl object-cover border border-[#1E1E26] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate">{comm.name}</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-800/40 font-mono">
                    {comm.membersCount.toLocaleString()} members
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {comm.description}
                </p>
              </div>
            </div>

            {/* Sub-Channels List */}
            <div className="space-y-1.5 pt-2 border-t border-[#1E1E26]/60">
              {comm.subChannels.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onSelectChannel(`${comm.name} · ${sub.name}`)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#14141B] text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#181822] text-violet-400 flex items-center justify-center shrink-0">
                      <Hash className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white block truncate">
                        {sub.name}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate block">
                        {sub.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {sub.unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-violet-600 text-white font-bold text-[10px]">
                        {sub.unreadCount}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
