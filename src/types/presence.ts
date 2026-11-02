export type NotificationState = 'enabled' | 'muted' | 'dnd' | 'disabled';
export type AppState = 'foreground' | 'background' | 'closed';
export type PrivacySetting = 'public' | 'contacts' | 'stealth';
export type PresenceVerdict = 'online' | 'away' | 'offline' | 'hidden';

export interface PeerUser {
  id: string;
  name: string;
  role: string;
  avatarSeed: string;
  deviceType: 'ios' | 'android' | 'desktop' | 'web';
  notificationState: NotificationState;
  appState: AppState;
  privacySetting: PrivacySetting;
  lastHeartbeatMsAgo: number;
  idleSeconds: number;
  socketConnected: boolean;
  latencyMs: number;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  peerId: string;
  peerName: string;
  eventType: 'HEARTBEAT' | 'VISIBILITY_CHANGE' | 'NOTIFICATION_TOGGLE' | 'SOCKET_EVENT' | 'PROBE_SCAN';
  status: PresenceVerdict;
  details: string;
  packetData?: Record<string, unknown>;
}

export interface ProbeScenario {
  device: 'ios' | 'android' | 'desktop_app' | 'browser_tab';
  notificationSetting: NotificationState;
  appState: AppState;
  networkState: 'connected' | 'unstable' | 'airplane';
  privacyMode: PrivacySetting;
}

export interface ProbeResult {
  verdict: PresenceVerdict;
  confidence: number;
  socketStatus: 'active' | 'degraded' | 'closed';
  heartbeatSuccess: boolean;
  visibilityReported: 'visible' | 'hidden' | 'unknown';
  pushNotificationChannel: 'delivering' | 'suppressed' | 'blocked';
  technicalReasoning: string[];
}
