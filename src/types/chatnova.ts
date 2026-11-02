export type NavigationTab = 'chats' | 'status' | 'communities' | 'calls' | 'settings';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';
export type MediaType = 'text' | 'image' | 'video' | 'audio' | 'document';
export type DisappearingDuration = 'off' | '24h' | '7d' | '90d';

export interface PrivacySettings {
  hideOnlineStatus: boolean;
  lastSeenVisibility: 'everyone' | 'contacts' | 'nobody';
  readReceiptsEnabled: boolean;
  typingIndicatorEnabled: boolean;
  profilePicVisibility: 'everyone' | 'contacts' | 'nobody';
  statusAudience: 'everyone' | 'contacts' | 'except';
  appLockPin: string | null;
  isBiometricEnabled: boolean;
  disappearingDefault: DisappearingDuration;
}

export interface ThemeSettings {
  mode: 'dark' | 'light';
  preset: 'obsidian' | 'violet' | 'cyan' | 'emerald';
  accentColor: string;
  wallpaperId: string;
  fontSize: 'small' | 'medium' | 'large';
  bubbleRadius: 'modern' | 'rounded' | 'sharp';
  soundEnabled: boolean;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  bio: string;
  phone: string;
  isOnline: boolean;
  lastSeen: string;
  publicKeyFingerprint: string;
  isVerified?: boolean;
}

export interface ReplyPreview {
  id: string;
  content: string;
  senderName: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  mediaType: MediaType;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: number;
  status: MessageStatus;
  replyTo?: ReplyPreview;
  reactions: Record<string, string[]>; // emoji -> [userIds]
  isEdited?: boolean;
  isForwarded?: boolean;
  isDeleted?: boolean;
  timestamp: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'community';
  name: string;
  avatarUrl: string;
  participants: string[];
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  isLocked: boolean;
  isMuted: boolean;
  disappearingDuration: DisappearingDuration;
  lastMessage?: {
    content: string;
    timestamp: string;
    senderId: string;
    mediaType: MediaType;
    status: MessageStatus;
  };
  updatedAt: string;
  encryptionKeyId: string;
  groupDescription?: string;
  groupAdmins?: string[];
}

export interface StatusUpdate {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaType: 'text' | 'image' | 'video';
  content: string;
  backgroundColor?: string;
  caption?: string;
  timestamp: string;
  expiresAt: string;
  viewers: string[];
  reactions: Record<string, string[]>;
}

export interface CallRecord {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  direction: 'incoming' | 'outgoing';
  callType: 'voice' | 'video';
  status: 'missed' | 'answered' | 'rejected';
  timestamp: string;
  durationSeconds: number;
}

export interface CommunitySubChannel {
  id: string;
  name: string;
  description: string;
  unreadCount: number;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  membersCount: number;
  announcementChannelId: string;
  subChannels: CommunitySubChannel[];
}

export interface AdminReport {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterName: string;
  reason: string;
  category: 'spam' | 'harassment' | 'malware' | 'impersonation';
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  status: 'pending' | 'resolved' | 'suspended';
}
