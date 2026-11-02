import React, { useState } from 'react';
import { Pin, Archive, Lock, VolumeX, Check, CheckCheck, Clock, Search, MoreVertical, ShieldAlert } from 'lucide-react';
import { Conversation, MessageStatus } from '../../types/chatnova';

interface ChatListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onToggleArchive: (id: string, e: React.MouseEvent) => void;
  onToggleLock: (id: string, e: React.MouseEvent) => void;
  onToggleMute: (id: string, e: React.MouseEvent) => void;
  searchQuery: string;
  typingUsers: Record<string, boolean>; // convId -> isTyping
}

export const ChatList: React.FC<ChatListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onTogglePin,
  onToggleArchive,
  onToggleLock,
  onToggleMute,
  searchQuery,
  typingUsers,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups' | 'locked'>('all');
  const [showArchived, setShowArchived] = useState(false);

  const archivedCount = conversations.filter((c) => c.isArchived).length;

  const filtered = conversations.filter((conv) => {
    // If showArchived is false, hide archived unless searching
    if (!showArchived && conv.isArchived && searchQuery.trim() === '') return false;
    if (showArchived && !conv.isArchived) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        conv.name.toLowerCase().includes(q) ||
        (conv.lastMessage?.content.toLowerCase().includes(q) ?? false)
      );
    }

    if (filter === 'unread') return conv.unreadCount > 0;
    if (filter === 'groups') return conv.type === 'group';
    if (filter === 'locked') return conv.isLocked;
    return true;
  });

  const renderStatusTicks = (status?: MessageStatus) => {
    if (!status) return null;
    if (status === 'sending') return <Clock className="w-3 h-3 text-slate-500 inline mr-1" />;
    if (status === 'sent') return <Check className="w-3 h-3 text-slate-400 inline mr-1" />;
    if (status === 'delivered') return <CheckCheck className="w-3 h-3 text-slate-400 inline mr-1" />;
    if (status === 'read') return <CheckCheck className="w-3 h-3 text-cyan-400 inline mr-1" />;
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-[#070709] border-r border-[#1E1E26]">
      {/* Mobile search bar if query present or filter chips */}
      <div className="p-3 border-b border-[#1E1E26] space-y-2">
        {/* Segmented Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'groups', label: 'Groups' },
            { id: 'locked', label: 'Locked 🔒' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => {
                setShowArchived(false);
                setFilter(pill.id as any);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                filter === pill.id && !showArchived
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-[#111116] text-slate-400 hover:text-white border border-[#1E1E26]'
              }`}
            >
              {pill.label}
            </button>
          ))}

          {archivedCount > 0 && (
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                showArchived
                  ? 'bg-cyan-600 text-white'
                  : 'bg-[#111116] text-slate-400 hover:text-white border border-[#1E1E26]'
              }`}
            >
              <Archive className="w-3 h-3" />
              <span>Archived ({archivedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#1E1E26]/50">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-400">No conversations found</p>
            <p>Try searching for a contact or start a new encrypted chat.</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const isActive = activeConversationId === conv.id;
            const isTyping = typingUsers[conv.id];

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`flex items-center gap-3 p-3.5 transition-colors cursor-pointer group relative ${
                  isActive
                    ? 'bg-[#14141B] border-l-2 border-violet-500'
                    : 'hover:bg-[#0D0D12]'
                }`}
              >
                {/* Avatar with Online indicator */}
                <div className="relative shrink-0">
                  <img
                    src={conv.avatarUrl}
                    alt={conv.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-[#1E1E26]"
                    loading="lazy"
                  />
                  {conv.type === 'direct' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#070709]" />
                  )}
                  {conv.isLocked && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-950 border border-violet-600 text-violet-300 flex items-center justify-center">
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Center Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs sm:text-sm font-semibold text-white truncate">
                        {conv.name}
                      </span>
                      {conv.disappearingDuration !== 'off' && (
                        <span className="text-[10px] text-cyan-400 font-mono" title={`Disappearing messages: ${conv.disappearingDuration}`}>
                          ⏱️{conv.disappearingDuration}
                        </span>
                      )}
                    </div>
                    <span className="text-[10.5px] text-slate-400 font-mono tabular-nums shrink-0">
                      {conv.updatedAt}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-400 truncate flex-1">
                      {isTyping ? (
                        <span className="text-cyan-400 font-semibold animate-pulse flex items-center gap-1">
                          typing...
                        </span>
                      ) : (
                        <span>
                          {conv.lastMessage?.senderId === 'usr_me' && renderStatusTicks(conv.lastMessage?.status)}
                          {conv.lastMessage?.content || 'Encrypted conversation started.'}
                        </span>
                      )}
                    </p>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {conv.isMuted && <VolumeX className="w-3.5 h-3.5 text-slate-600" />}
                      {conv.isPinned && <Pin className="w-3.5 h-3.5 text-violet-400 fill-current" />}
                      {conv.unreadCount > 0 && (
                        <span className="min-w-4 h-4 px-1 rounded-full bg-violet-600 text-white font-bold text-[10px] flex items-center justify-center tabular-nums">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick actions popup on hover for power users */}
                <div className="hidden group-hover:flex items-center gap-1 absolute right-2 bottom-1 bg-[#16161F] px-1 py-0.5 rounded-lg border border-[#2A2A38] shadow-lg">
                  <button
                    onClick={(e) => onTogglePin(conv.id, e)}
                    className="p-1 text-slate-400 hover:text-violet-400"
                    title={conv.isPinned ? 'Unpin' : 'Pin'}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => onToggleLock(conv.id, e)}
                    className="p-1 text-slate-400 hover:text-cyan-400"
                    title={conv.isLocked ? 'Unlock' : 'Lock with PIN'}
                  >
                    <Lock className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => onToggleMute(conv.id, e)}
                    className="p-1 text-slate-400 hover:text-amber-400"
                    title={conv.isMuted ? 'Unmute' : 'Mute'}
                  >
                    <VolumeX className="w-3 h-3" />
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
