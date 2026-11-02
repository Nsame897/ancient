import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, Phone, Video, Lock, MoreVertical, Paperclip, Smile, Mic, Send,
  Check, CheckCheck, Clock, Reply, Edit3, Trash2, Forward, Shield, Play, Pause,
  FileText, Image as ImageIcon, Volume2, Sparkles, X, CornerDownRight
} from 'lucide-react';
import { Conversation, Message, MediaType, ReplyPreview, DisappearingDuration } from '../../types/chatnova';
import { soundFx } from '../../utils/audio';

interface ActiveChatProps {
  conversation: Conversation;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (content: string, mediaType?: MediaType, replyTo?: ReplyPreview) => void;
  onReactMessage: (messageId: string, emoji: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onStartCall: (callType: 'voice' | 'video') => void;
  onOpenE2EEInfo: () => void;
  onToggleDisappearing: (duration: DisappearingDuration) => void;
  wallpaperStyle: React.CSSProperties;
  typingPeerName: string | null;
  onTyping: (isTyping: boolean) => void;
}

export const ActiveChat: React.FC<ActiveChatProps> = ({
  conversation,
  messages,
  onBack,
  onSendMessage,
  onReactMessage,
  onDeleteMessage,
  onEditMessage,
  onStartCall,
  onOpenE2EEInfo,
  onToggleDisappearing,
  wallpaperStyle,
  typingPeerName,
  onTyping,
}) => {
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<ReplyPreview | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [activeMenuMsgId, setActiveMenuMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const emojis = ['👍', '❤️', '🔥', '😂', '😮', '👏', '🚀', '🔒'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingPeerName]);

  // Voice recording simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    onTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (editingMessageId) {
      if (inputText.trim()) {
        onEditMessage(editingMessageId, inputText.trim());
      }
      setEditingMessageId(null);
      setInputText('');
      return;
    }

    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), 'text', replyingTo || undefined);
    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
    onTyping(false);
  };

  const handleSendVoiceNote = () => {
    setIsRecordingVoice(false);
    onSendMessage(`Voice message (${recordingSeconds || 4}s)`, 'audio');
    soundFx.playSent();
  };

  const handleSendMediaSim = (type: MediaType, name: string) => {
    setShowAttachMenu(false);
    onSendMessage(name, type);
  };

  const renderStatusTicks = (status: Message['status']) => {
    if (status === 'sending') return <Clock className="w-3 h-3 text-slate-500" />;
    if (status === 'sent') return <Check className="w-3 h-3 text-slate-400" />;
    if (status === 'delivered') return <CheckCheck className="w-3 h-3 text-slate-400" />;
    if (status === 'read') return <CheckCheck className="w-3 h-3 text-cyan-400" />;
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-[#070709] relative overflow-hidden">
      {/* Chat Top Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-[#070709]/95 backdrop-blur-md border-b border-[#1E1E26] z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onBack}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#111116] transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Contact Avatar */}
          <div className="relative shrink-0">
            <img
              src={conversation.avatarUrl}
              alt={conversation.name}
              className="w-10 h-10 rounded-2xl object-cover border border-[#1E1E26]"
            />
            {conversation.type === 'direct' && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#070709]" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white truncate">
                {conversation.name}
              </h2>
              <button
                onClick={onOpenE2EEInfo}
                className="text-violet-400 hover:text-violet-300"
                title="End-to-End Encrypted Session Key"
              >
                <Lock className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {typingPeerName ? (
                <span className="text-cyan-400 font-semibold animate-pulse">
                  {typingPeerName} is typing...
                </span>
              ) : conversation.type === 'group' ? (
                `${conversation.participants.length} participants`
              ) : (
                'Online · Tap for security details'
              )}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => onStartCall('video')}
            className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-[#14141B] rounded-xl transition-colors cursor-pointer"
            title="Video Call"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStartCall('voice')}
            className="p-2 text-slate-300 hover:text-violet-400 hover:bg-[#14141B] rounded-xl transition-colors cursor-pointer"
            title="Voice Call"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenE2EEInfo}
            className="p-2 text-slate-400 hover:text-white hover:bg-[#14141B] rounded-xl transition-colors cursor-pointer"
            title="View Encryption Keys & Audit"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Feed with Dynamic Wallpaper */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3.5 relative"
        style={wallpaperStyle}
      >
        {/* E2EE Lock Banner */}
        <div className="flex justify-center my-2">
          <button
            onClick={onOpenE2EEInfo}
            className="flex items-center gap-2 max-w-sm px-3.5 py-1.5 rounded-xl bg-[#111116]/80 border border-[#1E1E26] backdrop-blur-md text-center text-[11px] text-slate-400 hover:border-violet-500/40 transition-colors shadow-sm cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span>Messages are end-to-end encrypted with Double Ratchet. Tap to inspect keys.</span>
          </button>
        </div>

        {/* Disappearing Messages Indicator */}
        {conversation.disappearingDuration !== 'off' && (
          <div className="flex justify-center my-1">
            <span className="text-[10.5px] text-cyan-400/90 font-mono bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
              ⏱️ Disappearing messages active: {conversation.disappearingDuration}
            </span>
          </div>
        )}

        {/* Message Items */}
        {messages.map((msg) => {
          const isMe = msg.senderId === 'usr_me';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}
            >
              {/* Message Bubble Container */}
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2.5 relative shadow-md transition-all ${
                  isMe
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-xs'
                    : 'bg-[#121218] border border-[#1E1E26] text-slate-100 rounded-tl-xs'
                }`}
              >
                {/* Reply context if present */}
                {msg.replyTo && (
                  <div
                    className={`mb-2 p-2 rounded-lg text-[11px] border-l-2 ${
                      isMe
                        ? 'bg-black/20 border-white/60 text-white/90'
                        : 'bg-black/40 border-violet-500 text-slate-300'
                    }`}
                  >
                    <span className="font-semibold block truncate">
                      {msg.replyTo.senderName}
                    </span>
                    <span className="truncate block opacity-80">
                      {msg.replyTo.content}
                    </span>
                  </div>
                )}

                {/* Sender Name in Group Chat */}
                {!isMe && conversation.type === 'group' && (
                  <span className="text-[11px] font-bold text-cyan-400 block mb-0.5">
                    {msg.senderName}
                  </span>
                )}

                {/* Content Rendering based on mediaType */}
                {msg.mediaType === 'text' && (
                  <p className="text-xs sm:text-[13px] leading-relaxed break-words whitespace-pre-wrap">
                    {msg.content}
                  </p>
                )}

                {msg.mediaType === 'audio' && (
                  <div className="flex items-center gap-3 py-1 min-w-[200px]">
                    <button
                      onClick={() => {
                        if (playingVoiceId === msg.id) {
                          setPlayingVoiceId(null);
                        } else {
                          setPlayingVoiceId(msg.id);
                          soundFx.playPop();
                        }
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                        isMe ? 'bg-white text-violet-700' : 'bg-violet-600 text-white'
                      }`}
                    >
                      {playingVoiceId === msg.id ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Simulated Voice Waveform */}
                    <div className="flex-1 flex items-center gap-0.5 h-6">
                      {[40, 70, 95, 60, 80, 100, 50, 85, 30, 90, 65, 45, 75, 35, 80].map((h, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all ${
                            playingVoiceId === msg.id && i < 8 ? 'bg-cyan-300' : isMe ? 'bg-white/60' : 'bg-slate-500'
                          }`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>

                    <span className="text-[10px] font-mono tabular-nums opacity-80 shrink-0">
                      0:0{msg.audioDuration || 6}
                    </span>
                  </div>
                )}

                {msg.mediaType === 'image' && (
                  <div className="rounded-xl overflow-hidden my-1 max-w-xs">
                    <img
                      src={msg.mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
                      alt="Attachment"
                      className="w-full h-auto rounded-lg object-cover"
                    />
                    {msg.content && (
                      <p className="text-xs mt-1.5 leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                )}

                {msg.mediaType === 'document' && (
                  <div className="flex items-center gap-3 p-2 bg-black/20 rounded-xl my-1">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold block truncate">
                        {msg.fileName || 'cryptographic_whitepaper.pdf'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {msg.fileSize || '1.4 MB'} · Verified Clean
                      </span>
                    </div>
                  </div>
                )}

                {/* Footer of Bubble: Time & Status */}
                <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] opacity-75 font-mono">
                  {msg.isEdited && <span className="italic">edited</span>}
                  <span>{msg.timestamp}</span>
                  {isMe && renderStatusTicks(msg.status)}
                </div>

                {/* Reactions list at bottom of bubble */}
                {Object.keys(msg.reactions).length > 0 && (
                  <div className="flex items-center gap-1 mt-1 pt-1 border-t border-white/10">
                    {Object.entries(msg.reactions).map(([emoji, users]) => (
                      <button
                        key={emoji}
                        onClick={() => onReactMessage(msg.id, emoji)}
                        className="px-1.5 py-0.5 rounded-full bg-black/40 text-xs flex items-center gap-1 hover:scale-105 transition-transform"
                      >
                        <span>{emoji}</span>
                        <span className="text-[10px] font-mono">{users.length}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Floating Quick Action Trigger on Hover */}
              <div
                className={`hidden group-hover:flex items-center gap-1 bg-[#111116] px-2 py-1 rounded-xl border border-[#22222E] shadow-xl absolute -top-4 ${
                  isMe ? 'right-2' : 'left-2'
                } z-10`}
              >
                {emojis.slice(0, 4).map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onReactMessage(msg.id, emoji)}
                    className="hover:scale-125 transition-transform text-xs p-0.5 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
                <div className="w-[1px] h-3 bg-[#2A2A38] mx-0.5" />
                <button
                  onClick={() => setReplyingTo({ id: msg.id, content: msg.content, senderName: msg.senderName })}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Reply"
                >
                  <Reply className="w-3 h-3" />
                </button>
                {isMe && (
                  <>
                    <button
                      onClick={() => {
                        setEditingMessageId(msg.id);
                        setInputText(msg.content);
                      }}
                      className="p-1 text-slate-400 hover:text-cyan-400"
                      title="Edit"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      className="p-1 text-slate-400 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Replying banner */}
      {replyingTo && (
        <div className="px-4 py-2 bg-[#121218] border-t border-[#1E1E26] flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2 min-w-0">
            <CornerDownRight className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-violet-300 block">
                Replying to {replyingTo.senderName}
              </span>
              <span className="text-slate-400 truncate block text-[11px]">
                {replyingTo.content}
              </span>
            </div>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editing banner */}
      {editingMessageId && (
        <div className="px-4 py-2 bg-cyan-950/40 border-t border-cyan-800/40 flex items-center justify-between text-xs text-cyan-300">
          <span>Editing message...</span>
          <button
            onClick={() => {
              setEditingMessageId(null);
              setInputText('');
            }}
            className="text-slate-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Attachment Drawer Modal/Popup */}
      {showAttachMenu && (
        <div className="absolute bottom-16 left-4 z-30 bg-[#121218] border border-[#22222E] rounded-2xl p-3 shadow-2xl grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => handleSendMediaSim('image', 'photo_encrypted_vault.jpg')}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#1E1E28] text-slate-300 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Photo</span>
          </button>
          <button
            onClick={() => handleSendMediaSim('document', 'security_audit_report.pdf')}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#1E1E28] text-slate-300 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Document</span>
          </button>
          <button
            onClick={() => onToggleDisappearing(conversation.disappearingDuration === 'off' ? '24h' : 'off')}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#1E1E28] text-slate-300 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px]">Timer</span>
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 bg-[#070709] border-t border-[#1E1E26] safe-area-pb">
        <div className="flex items-center gap-2">
          {isRecordingVoice ? (
            <div className="flex-1 flex items-center justify-between px-4 py-2.5 bg-rose-950/40 border border-rose-800/40 rounded-2xl animate-pulse">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Recording encrypted voice note: 0:0{recordingSeconds}s</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRecordingVoice(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendVoiceNote}
                  className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Attachment Button */}
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2 text-slate-400 hover:text-white hover:bg-[#14141B] rounded-xl transition-colors cursor-pointer"
                aria-label="Attachments"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  placeholder="Type an encrypted message..."
                  className="w-full bg-[#111116] border border-[#1E1E26] rounded-2xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />

                {/* Emoji trigger inside input */}
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 p-1"
                >
                  <Smile className="w-4 h-4" />
                </button>

                {/* Quick Emoji Shelf */}
                {showEmojiPicker && (
                  <div className="absolute bottom-12 right-0 bg-[#121218] border border-[#22222E] rounded-xl p-2 shadow-2xl flex items-center gap-1.5 z-30 animate-in fade-in">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setInputText((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-base p-1 hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mic / Send Button */}
              {inputText.trim() ? (
                <button
                  onClick={handleSend}
                  className="p-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl shadow-md shadow-violet-600/20 active:scale-95 transition-all cursor-pointer"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsRecordingVoice(true)}
                  className="p-2.5 bg-[#14141B] hover:bg-[#1E1E28] text-slate-300 hover:text-cyan-400 rounded-xl transition-colors cursor-pointer"
                  title="Hold/Click to record voice note"
                  aria-label="Record Voice Note"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
