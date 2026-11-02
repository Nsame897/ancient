import React, { useState, useEffect, useMemo } from 'react';
import {
  NavigationTab, Conversation, Message, StatusUpdate, CallRecord,
  PrivacySettings, ThemeSettings, User, MediaType, ReplyPreview, DisappearingDuration
} from './types/chatnova';
import {
  CURRENT_USER, INITIAL_CONTACTS, INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES, INITIAL_STATUSES, INITIAL_CALLS, INITIAL_COMMUNITIES,
  WALLPAPER_PRESETS
} from './data/mockData';
import { TabBar } from './components/navigation/TabBar';
import { TopBar } from './components/navigation/TopBar';
import { ChatList } from './components/chat/ChatList';
import { ActiveChat } from './components/chat/ActiveChat';
import { StatusView } from './components/status/StatusView';
import { CommunitiesView } from './components/communities/CommunitiesView';
import { CallsView } from './components/calls/CallsView';
import { SettingsView } from './components/settings/SettingsView';
import { PrivacySettingsModal } from './components/privacy/PrivacySettingsModal';
import { ThemeCustomizer } from './components/customization/ThemeCustomizer';
import { CallModal } from './components/calling/CallModal';
import { E2EEInspectorModal } from './components/security/E2EEInspectorModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { NewChatModal } from './components/chat/NewChatModal';
import { AppLockScreen } from './components/common/AppLockScreen';
import { chatSocket } from './services/chatSocket';
import { soundFx } from './utils/audio';
import { MessageSquare, Lock, Shield, Sparkles } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'chatnova_v2_store';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<NavigationTab>('chats');
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv_elena');
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data Stores (with localStorage persistence)
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_convs`);
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_msgs`);
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [statuses, setStatuses] = useState<StatusUpdate[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_stats`);
      return saved ? JSON.parse(saved) : INITIAL_STATUSES;
    } catch {
      return INITIAL_STATUSES;
    }
  });

  const [calls, setCalls] = useState<CallRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_calls`);
      return saved ? JSON.parse(saved) : INITIAL_CALLS;
    } catch {
      return INITIAL_CALLS;
    }
  });

  // Privacy & Customization settings
  const [privacy, setPrivacy] = useState<PrivacySettings>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_priv`);
      return saved ? JSON.parse(saved) : {
        hideOnlineStatus: false,
        lastSeenVisibility: 'everyone',
        readReceiptsEnabled: true,
        typingIndicatorEnabled: true,
        profilePicVisibility: 'everyone',
        statusAudience: 'everyone',
        appLockPin: null,
        isBiometricEnabled: true,
        disappearingDefault: 'off',
      };
    } catch {
      return {
        hideOnlineStatus: false,
        lastSeenVisibility: 'everyone',
        readReceiptsEnabled: true,
        typingIndicatorEnabled: true,
        profilePicVisibility: 'everyone',
        statusAudience: 'everyone',
        appLockPin: null,
        isBiometricEnabled: true,
        disappearingDefault: 'off',
      };
    }
  });

  const [theme, setTheme] = useState<ThemeSettings>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_theme`);
      return saved ? JSON.parse(saved) : {
        mode: 'dark',
        preset: 'obsidian',
        accentColor: '#8B5CF6',
        wallpaperId: 'cyber-mesh',
        fontSize: 'medium',
        bubbleRadius: 'modern',
        soundEnabled: true,
      };
    } catch {
      return {
        mode: 'dark',
        preset: 'obsidian',
        accentColor: '#8B5CF6',
        wallpaperId: 'cyber-mesh',
        fontSize: 'medium',
        bubbleRadius: 'modern',
        soundEnabled: true,
      };
    }
  });

  // App Lock security state
  const [isAppLocked, setIsAppLocked] = useState<boolean>(() => !!privacy.appLockPin);

  // Active Call state
  const [activeCall, setActiveCall] = useState<{
    contactId: string;
    contactName: string;
    contactAvatar: string;
    callType: 'voice' | 'video';
  } | null>(null);

  // Modals state
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showE2EEModal, setShowE2EEModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Real-time peer typing indicators
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_convs`, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_msgs`, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_stats`, JSON.stringify(statuses));
  }, [statuses]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_calls`, JSON.stringify(calls));
  }, [calls]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_priv`, JSON.stringify(privacy));
  }, [privacy]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_theme`, JSON.stringify(theme));
  }, [theme]);

  // Initialize WebSocket service
  useEffect(() => {
    chatSocket.init(CURRENT_USER.id);

    const unsubMsg = chatSocket.onMessage((newMsg) => {
      setMessages((prev) => ({
        ...prev,
        [newMsg.conversationId]: [...(prev[newMsg.conversationId] || []), newMsg],
      }));
      if (theme.soundEnabled) soundFx.playReceived();
    });

    const unsubTyping = chatSocket.onTyping((data) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.conversationId]: data.isTyping,
      }));
    });

    return () => {
      unsubMsg();
      unsubTyping();
    };
  }, [theme.soundEnabled]);

  // Active conversation object
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  // Wallpaper styling
  const activeWallpaperStyle = useMemo(() => {
    const preset = WALLPAPER_PRESETS.find((w) => w.id === theme.wallpaperId);
    return preset ? preset.style : { backgroundColor: '#070709' };
  }, [theme.wallpaperId]);

  // Handle Send Message
  const handleSendMessage = (content: string, mediaType: MediaType = 'text', replyTo?: ReplyPreview) => {
    if (!activeConversationId) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      conversationId: activeConversationId,
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      content,
      mediaType,
      status: 'delivered',
      replyTo,
      reactions: {},
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Optimistic local append
    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMsg],
    }));

    // Update conversation preview
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              updatedAt: newMsg.timestamp,
              lastMessage: {
                content: mediaType === 'audio' ? '🎤 Voice message' : content,
                timestamp: newMsg.timestamp,
                senderId: CURRENT_USER.id,
                mediaType,
                status: 'delivered',
              },
            }
          : c
      )
    );

    if (theme.soundEnabled) soundFx.playSent();

    // Broadcast over WebSocket if connected
    if (activeConversation) {
      chatSocket.sendMessage(newMsg, activeConversation.participants);
    }

    // Realistic Simulated Peer Response (so the app feels 100% interactive and alive!)
    if (activeConversation?.type === 'direct' && activeConversation.participants.includes('usr_elena')) {
      setTimeout(() => {
        setTypingUsers((prev) => ({ ...prev, [activeConversationId]: true }));
      }, 700);

      setTimeout(() => {
        setTypingUsers((prev) => ({ ...prev, [activeConversationId]: false }));

        const replies = [
          'Received securely! The Double Ratchet session key is rotating on every packet.',
          'Awesome, this AMOLED contrast looks stunning. Battery consumption is minimal.',
          'Tested the stealth cloaking—my status remained offline as requested!',
          'Sounds great! Voice note audio decoded crystal clear.',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const peerMsg: Message = {
          id: `msg_elena_${Date.now()}`,
          conversationId: activeConversationId,
          senderId: 'usr_elena',
          senderName: 'Elena Rostova',
          content: randomReply,
          mediaType: 'text',
          status: 'read',
          reactions: {},
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => ({
          ...prev,
          [activeConversationId]: [...(prev[activeConversationId] || []), peerMsg],
        }));

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? {
                  ...c,
                  updatedAt: peerMsg.timestamp,
                  lastMessage: {
                    content: randomReply,
                    timestamp: peerMsg.timestamp,
                    senderId: 'usr_elena',
                    mediaType: 'text',
                    status: 'read',
                  },
                }
              : c
          )
        );

        if (theme.soundEnabled) soundFx.playReceived();
      }, 2200);
    }
  };

  // Reactions
  const handleReactMessage = (messageId: string, emoji: string) => {
    if (!activeConversationId) return;

    setMessages((prev) => {
      const convMsgs = prev[activeConversationId] || [];
      const updated = convMsgs.map((m) => {
        if (m.id === messageId) {
          const existing = m.reactions[emoji] || [];
          const hasReacted = existing.includes(CURRENT_USER.id);
          const nextUsers = hasReacted
            ? existing.filter((id) => id !== CURRENT_USER.id)
            : [...existing, CURRENT_USER.id];

          const nextReactions = { ...m.reactions };
          if (nextUsers.length > 0) {
            nextReactions[emoji] = nextUsers;
          } else {
            delete nextReactions[emoji];
          }
          return { ...m, reactions: nextReactions };
        }
        return m;
      });
      return { ...prev, [activeConversationId]: updated };
    });
  };

  // Delete message
  const handleDeleteMessage = (messageId: string) => {
    if (!activeConversationId) return;
    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: (prev[activeConversationId] || []).filter((m) => m.id !== messageId),
    }));
  };

  // Edit message
  const handleEditMessage = (messageId: string, newContent: string) => {
    if (!activeConversationId) return;
    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: (prev[activeConversationId] || []).map((m) =>
        m.id === messageId ? { ...m, content: newContent, isEdited: true } : m
      ),
    }));
  };

  // Calls
  const handleStartCall = (contactId: string, contactName: string, callType: 'voice' | 'video') => {
    const contact = INITIAL_CONTACTS.find((c) => c.id === contactId) || {
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    };

    setActiveCall({
      contactId,
      contactName,
      contactAvatar: contact.avatarUrl,
      callType,
    });
  };

  const handleEndCall = (durationSeconds: number) => {
    if (activeCall) {
      const newRecord: CallRecord = {
        id: `call_${Date.now()}`,
        contactId: activeCall.contactId,
        contactName: activeCall.contactName,
        contactAvatar: activeCall.contactAvatar,
        direction: 'outgoing',
        callType: activeCall.callType,
        status: durationSeconds > 0 ? 'answered' : 'missed',
        timestamp: 'Just now',
        durationSeconds,
      };

      setCalls((prev) => [newRecord, ...prev]);
      setActiveCall(null);
    }
  };

  // Start new direct chat or group
  const handleStartDirectChat = (contact: User) => {
    setShowNewChatModal(false);
    const existing = conversations.find((c) => c.participants.includes(contact.id) && c.type === 'direct');
    if (existing) {
      setActiveConversationId(existing.id);
      setActiveTab('chats');
    } else {
      const newConv: Conversation = {
        id: `conv_${contact.id}`,
        type: 'direct',
        name: contact.name,
        avatarUrl: contact.avatarUrl,
        participants: [CURRENT_USER.id, contact.id],
        unreadCount: 0,
        isPinned: false,
        isArchived: false,
        isLocked: false,
        isMuted: false,
        disappearingDuration: privacy.disappearingDefault,
        updatedAt: 'Just now',
        encryptionKeyId: `sec_key_${contact.id}_${Date.now()}`,
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      setActiveTab('chats');
    }
  };

  const handleStartGroupChat = (name: string, members: string[]) => {
    setShowNewChatModal(false);
    const newConv: Conversation = {
      id: `conv_grp_${Date.now()}`,
      type: 'group',
      name,
      avatarUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&q=80',
      participants: members,
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      isLocked: false,
      isMuted: false,
      disappearingDuration: privacy.disappearingDefault,
      updatedAt: 'Just now',
      encryptionKeyId: `sec_key_grp_${Date.now()}`,
      groupDescription: 'End-to-end encrypted group conversation',
      groupAdmins: [CURRENT_USER.id],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setActiveTab('chats');
  };

  // Add status
  const handleAddStatus = (newStat: Omit<StatusUpdate, 'id' | 'timestamp' | 'expiresAt' | 'viewers' | 'reactions'>) => {
    const created: StatusUpdate = {
      ...newStat,
      id: `stat_${Date.now()}`,
      timestamp: 'Just now',
      expiresAt: 'In 24 hours',
      viewers: [],
      reactions: {},
    };
    setStatuses((prev) => [created, ...prev]);
  };

  const handleReactStatus = (statusId: string, emoji: string) => {
    setStatuses((prev) =>
      prev.map((s) => {
        if (s.id === statusId) {
          const current = s.reactions[emoji] || [];
          return {
            ...s,
            reactions: {
              ...s.reactions,
              [emoji]: current.includes(CURRENT_USER.id) ? current : [...current, CURRENT_USER.id],
            },
          };
        }
        return s;
      })
    );
  };

  // Reply privately to status
  const handleReplyStatus = (targetUserId: string, text: string, statusPreview: string) => {
    const targetContact = INITIAL_CONTACTS.find((c) => c.id === targetUserId);
    if (!targetContact) return;

    handleStartDirectChat(targetContact);
    setTimeout(() => {
      handleSendMessage(`Replied to your status: "${text}"`);
    }, 200);
  };

  // Pin/Archive/Lock/Mute toggles
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  const handleToggleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isArchived: !c.isArchived } : c))
    );
  };

  const handleToggleLock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isLocked: !c.isLocked } : c))
    );
  };

  const handleToggleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isMuted: !c.isMuted } : c))
    );
  };

  // Clear storage
  const handleResetStorage = () => {
    localStorage.clear();
    setConversations(INITIAL_CONVERSATIONS);
    setMessages(INITIAL_MESSAGES);
    setStatuses(INITIAL_STATUSES);
    setCalls(INITIAL_CALLS);
    setPrivacy({
      hideOnlineStatus: false,
      lastSeenVisibility: 'everyone',
      readReceiptsEnabled: true,
      typingIndicatorEnabled: true,
      profilePicVisibility: 'everyone',
      statusAudience: 'everyone',
      appLockPin: null,
      isBiometricEnabled: true,
      disappearingDefault: 'off',
    });
    setIsAppLocked(false);
  };

  // If App Lock is enabled and locked
  if (isAppLocked && privacy.appLockPin) {
    return (
      <AppLockScreen
        correctPin={privacy.appLockPin}
        onUnlock={() => setIsAppLocked(false)}
      />
    );
  }

  // Calculate unread totals
  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.isArchived ? 0 : c.unreadCount), 0);
  const totalMissedCalls = calls.filter((c) => c.status === 'missed').length;

  return (
    <div
      className={`h-screen w-screen overflow-hidden flex flex-col font-sans select-none ${
        theme.preset === 'violet'
          ? 'bg-[#0e071e] text-slate-100'
          : theme.preset === 'cyan'
          ? 'bg-[#04111c] text-slate-100'
          : theme.preset === 'emerald'
          ? 'bg-[#041410] text-slate-100'
          : 'bg-[#070709] text-slate-100'
      } ${
        theme.fontSize === 'small' ? 'text-xs' : theme.fontSize === 'large' ? 'text-base' : 'text-sm'
      }`}
    >
      {/* Top Header Bar */}
      <TopBar
        activeTab={activeTab}
        privacy={privacy}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenNewChat={() => setShowNewChatModal(true)}
        onOpenTheme={() => setShowThemeModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Workspace: Mobile Single-Pane / Desktop Dual-Pane Master Detail */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Pane (Master): Chats list, Status, Communities, Calls, or Settings */}
        <aside
          className={`h-full w-full md:w-96 lg:w-[420px] flex-shrink-0 flex flex-col border-r border-[#1E1E26] ${
            activeConversationId && activeTab === 'chats' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeTab === 'chats' && (
            <ChatList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={(id) => {
                setActiveConversationId(id);
                // Mark conversation as read
                setConversations((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
                );
              }}
              onTogglePin={handleTogglePin}
              onToggleArchive={handleToggleArchive}
              onToggleLock={handleToggleLock}
              onToggleMute={handleToggleMute}
              searchQuery={searchQuery}
              typingUsers={typingUsers}
            />
          )}

          {activeTab === 'status' && (
            <StatusView
              currentUser={CURRENT_USER}
              statuses={statuses}
              onAddStatus={handleAddStatus}
              onReactStatus={handleReactStatus}
              onReplyStatus={handleReplyStatus}
            />
          )}

          {activeTab === 'communities' && (
            <CommunitiesView
              communities={INITIAL_COMMUNITIES}
              onSelectChannel={(channelTitle) => {
                setActiveTab('chats');
                setActiveConversationId('conv_crypto_lab');
              }}
              onCreateCommunity={() => setShowNewChatModal(true)}
            />
          )}

          {activeTab === 'calls' && (
            <CallsView
              calls={calls}
              onStartCall={(contactId, contactName, callType) =>
                handleStartCall(contactId, contactName, callType)
              }
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currentUser={CURRENT_USER}
              privacy={privacy}
              theme={theme}
              onOpenPrivacy={() => setShowPrivacyModal(true)}
              onOpenTheme={() => setShowThemeModal(true)}
              onOpenE2EE={() => setShowE2EEModal(true)}
              onOpenAdmin={() => setShowAdminModal(true)}
              onClearStorage={handleResetStorage}
            />
          )}
        </aside>

        {/* Right Pane (Detail): Active Conversation Feed or Empty State */}
        <main
          className={`flex-1 h-full flex-col bg-[#070709] ${
            activeConversationId && activeTab === 'chats' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {activeConversation ? (
            <ActiveChat
              conversation={activeConversation}
              messages={messages[activeConversation.id] || []}
              onBack={() => setActiveConversationId(null)}
              onSendMessage={handleSendMessage}
              onReactMessage={handleReactMessage}
              onDeleteMessage={handleDeleteMessage}
              onEditMessage={handleEditMessage}
              onStartCall={(callType) =>
                handleStartCall(activeConversation.id, activeConversation.name, callType)
              }
              onOpenE2EEInfo={() => setShowE2EEModal(true)}
              onToggleDisappearing={(duration) => {
                setConversations((prev) =>
                  prev.map((c) => (c.id === activeConversation.id ? { ...c, disappearingDuration: duration } : c))
                );
              }}
              wallpaperStyle={activeWallpaperStyle}
              typingPeerName={typingUsers[activeConversation.id] ? activeConversation.name.split(' ')[0] : null}
              onTyping={(isTyping) => {
                if (privacy.typingIndicatorEnabled) {
                  chatSocket.sendTypingState(activeConversation.id, isTyping, activeConversation.participants);
                }
              }}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#070709] space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shadow-2xl">
                <MessageSquare className="w-10 h-10" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="text-lg font-bold text-white">ChatNova Encrypted Messenger</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select a contact or community from the left menu to start messaging with verified Double Ratchet end-to-end encryption.
                </p>
              </div>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-violet-600/20 transition-all cursor-pointer"
              >
                Start New Chat
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar (Chats, Status, Communities, Calls, Settings) */}
      <TabBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'chats') {
            setActiveConversationId(null);
          }
        }}
        unreadMessagesCount={totalUnreadMessages}
        unreadStatusCount={statuses.length}
        missedCallsCount={totalMissedCalls}
      />

      {/* Modals & Dialogs */}
      {showPrivacyModal && (
        <PrivacySettingsModal
          settings={privacy}
          onUpdate={(up) => setPrivacy((prev) => ({ ...prev, ...up }))}
          onClose={() => setShowPrivacyModal(false)}
        />
      )}

      {showThemeModal && (
        <ThemeCustomizer
          theme={theme}
          onUpdateTheme={(up) => setTheme((prev) => ({ ...prev, ...up }))}
          onClose={() => setShowThemeModal(false)}
        />
      )}

      {showE2EEModal && activeConversation && (
        <E2EEInspectorModal
          conversation={activeConversation}
          currentUser={CURRENT_USER}
          onClose={() => setShowE2EEModal(false)}
        />
      )}

      {showAdminModal && (
        <AdminDashboardModal
          onClose={() => setShowAdminModal(false)}
        />
      )}

      {showNewChatModal && (
        <NewChatModal
          onStartDirect={handleStartDirectChat}
          onStartGroup={handleStartGroupChat}
          onClose={() => setShowNewChatModal(false)}
        />
      )}

      {activeCall && (
        <CallModal
          contactName={activeCall.contactName}
          contactAvatar={activeCall.contactAvatar}
          callType={activeCall.callType}
          onEndCall={handleEndCall}
        />
      )}
    </div>
  );
}
