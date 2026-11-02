import React, { useState, useEffect } from 'react';
import { Plus, Eye, Clock, Heart, Send, X, ChevronLeft, ChevronRight, Sparkles, Image as ImageIcon, Type, Shield } from 'lucide-react';
import { StatusUpdate, User } from '../../types/chatnova';
import { soundFx } from '../../utils/audio';

interface StatusViewProps {
  currentUser: User;
  statuses: StatusUpdate[];
  onAddStatus: (status: Omit<StatusUpdate, 'id' | 'timestamp' | 'expiresAt' | 'viewers' | 'reactions'>) => void;
  onReactStatus: (statusId: string, emoji: string) => void;
  onReplyStatus: (userId: string, replyText: string, statusPreview: string) => void;
}

export const StatusView: React.FC<StatusViewProps> = ({
  currentUser,
  statuses,
  onAddStatus,
  onReactStatus,
  onReplyStatus,
}) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMode, setCreateMode] = useState<'text' | 'image'>('text');
  const [textContent, setTextContent] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedGradient, setSelectedGradient] = useState('from-violet-950 via-purple-900 to-indigo-950');
  const [replyInput, setReplyInput] = useState('');
  const [storyProgress, setStoryProgress] = useState(0);

  const gradients = [
    'from-violet-950 via-purple-900 to-indigo-950',
    'from-cyan-950 via-slate-900 to-emerald-950',
    'from-fuchsia-950 via-rose-900 to-amber-950',
    'from-slate-900 via-indigo-950 to-slate-950',
  ];

  // Auto-advance active story
  useEffect(() => {
    if (activeStoryIndex === null) return;

    setStoryProgress(0);
    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          if (activeStoryIndex < statuses.length - 1) {
            setActiveStoryIndex((idx) => (idx !== null ? idx + 1 : null));
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, statuses.length]);

  const handleCreateStatus = () => {
    if (createMode === 'text' && !textContent.trim()) return;

    onAddStatus({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      mediaType: createMode,
      content: createMode === 'text' ? textContent.trim() : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      backgroundColor: selectedGradient,
      caption: caption.trim() || undefined,
    });

    setTextContent('');
    setCaption('');
    setShowCreateModal(false);
    soundFx.playSent();
  };

  const handleSendReply = () => {
    if (activeStoryIndex === null || !replyInput.trim()) return;
    const story = statuses[activeStoryIndex];
    onReplyStatus(story.userId, replyInput.trim(), story.content);
    setReplyInput('');
    soundFx.playSent();
  };

  const currentStory = activeStoryIndex !== null ? statuses[activeStoryIndex] : null;

  return (
    <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E1E26]">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Status Stories</h2>
          <p className="text-xs text-slate-400">Updates disappear automatically after 24 hours</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-violet-600/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Status</span>
        </button>
      </div>

      {/* My Status Card */}
      <div
        onClick={() => setShowCreateModal(true)}
        className="flex items-center gap-3.5 p-3.5 bg-[#0D0D12] border border-[#1E1E26] rounded-2xl hover:border-violet-500/40 transition-colors cursor-pointer group"
      >
        <div className="relative shrink-0">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-13 h-13 rounded-2xl object-cover border border-[#1E1E26]"
          />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center border-2 border-[#070709]">
            <Plus className="w-3 h-3" />
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-bold text-white block">My Status</span>
          <span className="text-xs text-slate-400 block mt-0.5">
            Tap to add an encrypted photo or text status
          </span>
        </div>
        <span className="text-[11px] text-cyan-400 font-mono">24h Expiry</span>
      </div>

      {/* Contacts Recent Updates */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Recent Contact Updates ({statuses.length})
        </span>

        <div className="space-y-2">
          {statuses.map((status, idx) => (
            <div
              key={status.id}
              onClick={() => setActiveStoryIndex(idx)}
              className="flex items-center gap-3.5 p-3 bg-[#0D0D12] border border-[#1E1E26] rounded-2xl hover:bg-[#14141B] transition-all cursor-pointer group"
            >
              {/* Avatar with vivid 24h story ring */}
              <div className="p-0.5 rounded-2xl bg-gradient-to-tr from-violet-500 via-purple-500 to-cyan-400 shrink-0">
                <img
                  src={status.userAvatar}
                  alt={status.userName}
                  className="w-12 h-12 rounded-[14px] object-cover border-2 border-[#070709]"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-bold text-white truncate">
                    {status.userName}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                    {status.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {status.caption || status.content}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono shrink-0">
                <Eye className="w-3.5 h-3.5" />
                <span>{status.viewers.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Story Viewer Modal */}
      {currentStory && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md h-full sm:h-[90vh] bg-[#070709] sm:rounded-3xl border border-[#1E1E26] flex flex-col overflow-hidden relative shadow-2xl">
            {/* Progress Bars */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
              {statuses.map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all"
                    style={{
                      width:
                        i < (activeStoryIndex || 0)
                          ? '100%'
                          : i === activeStoryIndex
                          ? `${storyProgress}%`
                          : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Top Bar inside Viewer */}
            <div className="absolute top-6 left-4 right-4 z-30 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentStory.userAvatar}
                  alt={currentStory.userName}
                  className="w-9 h-9 rounded-full object-cover border border-white/40"
                />
                <div>
                  <span className="text-xs font-bold block">{currentStory.userName}</span>
                  <span className="text-[10px] text-white/70 font-mono">
                    {currentStory.timestamp} · {currentStory.expiresAt}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveStoryIndex(null)}
                className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/40 hover:bg-black/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Main Body Content */}
            <div className="flex-1 flex items-center justify-center relative p-6">
              {currentStory.mediaType === 'image' ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <img
                    src={currentStory.content}
                    alt="Story"
                    className="max-h-[70%] w-full object-contain rounded-2xl"
                  />
                  {currentStory.caption && (
                    <p className="mt-4 text-sm font-medium text-white text-center bg-black/60 px-4 py-2 rounded-xl backdrop-blur-md">
                      {currentStory.caption}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className={`w-full h-full rounded-2xl bg-gradient-to-br ${currentStory.backgroundColor} flex flex-col items-center justify-center p-8 text-center shadow-inner`}
                >
                  <p className="text-lg sm:text-xl font-bold text-white leading-relaxed text-balance">
                    {currentStory.content}
                  </p>
                  {currentStory.caption && (
                    <span className="mt-4 text-xs font-medium text-white/80 tracking-wide uppercase">
                      {currentStory.caption}
                    </span>
                  )}
                </div>
              )}

              {/* Prev / Next touch regions */}
              <button
                onClick={() => {
                  if (activeStoryIndex !== null && activeStoryIndex > 0) {
                    setActiveStoryIndex(activeStoryIndex - 1);
                  }
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => {
                  if (activeStoryIndex !== null) {
                    if (activeStoryIndex < statuses.length - 1) {
                      setActiveStoryIndex(activeStoryIndex + 1);
                    } else {
                      setActiveStoryIndex(null);
                    }
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Story Reply & Reactions Bar */}
            <div className="p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-30 space-y-3">
              {/* Quick Reactions */}
              <div className="flex items-center justify-center gap-3">
                {['❤️', '🔥', '👏', '😂', '😮', '🚀'].map((em) => (
                  <button
                    key={em}
                    onClick={() => {
                      onReactStatus(currentStory.id, em);
                      soundFx.playPop();
                    }}
                    className="text-xl hover:scale-125 transition-transform p-1 cursor-pointer"
                  >
                    {em}
                  </button>
                ))}
              </div>

              {/* Private Reply Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendReply();
                  }}
                  placeholder={`Reply privately to ${currentStory.userName}...`}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-white/60 focus:outline-none focus:border-violet-400"
                />
                <button
                  onClick={handleSendReply}
                  className="p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Status Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-[#0D0D12] border border-[#1E1E26] rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E1E26]">
              <h3 className="text-base font-bold text-white">Create 24h Status Update</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCreateMode('text')}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                  createMode === 'text'
                    ? 'bg-violet-600 text-white'
                    : 'bg-[#14141B] text-slate-400 hover:text-white'
                }`}
              >
                <Type className="w-4 h-4" />
                <span>Text Status</span>
              </button>
              <button
                onClick={() => setCreateMode('image')}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                  createMode === 'image'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-[#14141B] text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Photo Status</span>
              </button>
            </div>

            {createMode === 'text' ? (
              <div className="space-y-3">
                <div
                  className={`w-full h-40 rounded-2xl bg-gradient-to-br ${selectedGradient} p-4 flex items-center justify-center`}
                >
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Type what is on your mind..."
                    rows={3}
                    className="w-full bg-transparent text-center text-white placeholder:text-white/60 font-bold text-sm focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-center gap-2">
                  {gradients.map((grad) => (
                    <button
                      key={grad}
                      onClick={() => setSelectedGradient(grad)}
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${grad} border-2 ${
                        selectedGradient === grad ? 'border-white scale-110' : 'border-transparent'
                      } transition-all`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-full h-40 rounded-2xl bg-[#14141B] border border-dashed border-[#2A2A38] flex flex-col items-center justify-center text-slate-400 p-4">
                  <ImageIcon className="w-8 h-8 text-cyan-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-300">Photo Ready to Encrypt</span>
                  <span className="text-[11px] text-slate-500">Auto-expires in 24 hours</span>
                </div>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full bg-[#14141B] border border-[#1E1E26] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                <Shield className="w-3 h-3 text-emerald-400" />
                Protected by E2EE
              </span>
              <button
                onClick={handleCreateStatus}
                className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Post Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
