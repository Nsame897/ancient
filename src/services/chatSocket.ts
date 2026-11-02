import { Message, CallRecord } from '../types/chatnova';

type MessageCallback = (msg: Message) => void;
type TypingCallback = (data: { conversationId: string; userId: string; isTyping: boolean }) => void;
type PresenceCallback = (data: { userId: string; isOnline: boolean; lastSeen: string }) => void;
type CallCallback = (data: { fromUserId: string; signalType: string; payload: unknown }) => void;

class ChatSocketService {
  private socket: WebSocket | null = null;
  private messageListeners: Set<MessageCallback> = new Set();
  private typingListeners: Set<TypingCallback> = new Set();
  private presenceListeners: Set<PresenceCallback> = new Set();
  private callListeners: Set<CallCallback> = new Set();
  private userId: string | null = null;
  private isConnected: boolean = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  init(userId: string) {
    this.userId = userId;
    this.connect();
  }

  private connect() {
    if (typeof window === 'undefined') return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        if (this.userId) {
          this.send({ type: 'REGISTER_CLIENT', userId: this.userId });
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NEW_MESSAGE' && data.message) {
            this.messageListeners.forEach((cb) => cb(data.message));
          } else if (data.type === 'PEER_TYPING') {
            this.typingListeners.forEach((cb) => cb(data));
          } else if (data.type === 'PRESENCE_UPDATE') {
            this.presenceListeners.forEach((cb) => cb(data));
          } else if (data.type === 'CALL_SIGNAL') {
            this.callListeners.forEach((cb) => cb(data));
          }
        } catch {
          // ignore parsing error
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.scheduleReconnect();
      };

      this.socket.onerror = () => {
        this.isConnected = false;
      };
    } catch (e) {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 3000);
  }

  private send(data: Record<string, unknown>) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  sendMessage(message: Message, participants: string[]) {
    this.send({
      type: 'SEND_MESSAGE',
      message,
      participants,
    });
  }

  sendTypingState(conversationId: string, isTyping: boolean, participants: string[]) {
    this.send({
      type: 'TYPING_STATE',
      conversationId,
      isTyping,
      participants,
    });
  }

  sendCallSignal(targetUserId: string, signalType: 'invite' | 'accept' | 'decline' | 'hangup', payload?: unknown) {
    this.send({
      type: 'CALL_SIGNAL',
      targetUserId,
      signalType,
      payload,
    });
  }

  onMessage(cb: MessageCallback) {
    this.messageListeners.add(cb);
    return () => this.messageListeners.delete(cb);
  }

  onTyping(cb: TypingCallback) {
    this.typingListeners.add(cb);
    return () => this.typingListeners.delete(cb);
  }

  onPresence(cb: PresenceCallback) {
    this.presenceListeners.add(cb);
    return () => this.presenceListeners.delete(cb);
  }

  onCall(cb: CallCallback) {
    this.callListeners.add(cb);
    return () => this.callListeners.delete(cb);
  }
}

export const chatSocket = new ChatSocketService();
