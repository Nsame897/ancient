# CHATNOVA – Advanced Messaging Application

ChatNova is an original, privacy-first, highly customizable messaging platform inspired by the modularity and control of advanced messaging clients. It delivers real-time one-to-one and group messaging, 24-hour ephemeral status updates, simulated voice/video calling, deep customization (themes, accent colors, chat wallpapers), client-side privacy controls, end-to-end encryption key management, and an administrative security dashboard.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following core architectural decisions have been confirmed through user clarification:
> - **Backend & Persistence**: Full-stack Express server with real-time WebSockets and reliable local SQLite / persistent client storage, providing zero-latency synchronization, offline resilience, and full multi-device simulation.
> - **Visual Identity**: Obsidian AMOLED Dark (`#070709` base) with vivid violet (`#8B5CF6`) and electric cyan (`#06B6D4`) glowing accents, tailored for high-contrast mobile touch ergonomics and desktop responsive layouts.
> - **Voice & Video Calling**: Interactive simulated voice/video calling engine complete with realistic audio ringers, camera preview toggles, live duration counters, mute controls, and audio waveform visualizers.

---

## 1. Overview & Core Concept

ChatNova combines modern instant messaging with user sovereignty:
- **Five Primary Destinations**: Chats, Status Stories, Communities, Voice/Video Calls, and Settings.
- **Granular Privacy & Anti-Surveillance**: Toggle online status broadcast, granular last-seen visibility, read receipt suppression (without lying to the protocol), typing indicator cloaking, conversation PIN locks, and disappearing messages (24h/7d/90d).
- **Status Sharing Engine**: 24-hour expiring status updates supporting photo uploads, rich text cards with gradients, emoji reactions, and direct private replies.
- **Deep Customization Studio**: User-switchable theme engine (Obsidian Dark, Midnight Violet, Cyber Cyan, Emerald Minimal), customizable chat wallpapers, message bubble corner radius controls, and font scaling.
- **Security & Integrity**: Simulated client-side public/private key generation (X25519/AES-GCM concept), security audit logging, message tamper detection, and an Admin Trust & Safety console.

---

## 2. User Experience & Visual Design

### Mobile-First & Desktop Responsive Shell
- **Mobile Viewport ($375\text{px} - 430\text{px}$)**: Ergonomic bottom tab bar (Chats, Status, Communities, Calls, Settings) within the natural thumb zone ($44\text{px}+$ touch hitboxes), top header with search trigger and contextual menu, slide-up drawers for media and attachments.
- **Desktop Viewport ($1024\text{px} - 1440\text{px}$)**: Dual-pane master-detail messenger with left-side chat list / status rail and right-side active conversation viewport with message input bar, message inspector, and call overlay.

### Visual Identity & Design Tokens
- **Background**: AMOLED Obsidian (`#070709`), Surface Elevated (`#111116`), Border Hairline (`#1E1E26`).
- **Primary Accents**: Electric Violet (`#8B5CF6`) and Neon Cyan (`#06B6D4`).
- **Typography**: Display & Headers: *Plus Jakarta Sans* (bold, clean geometric); Message & Data: *JetBrains Mono* / tabular figures for timestamps and delivery flags.
- **Message Bubbles**:
  - Outgoing: Deep Violet-Cyan gradient (`bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm`).
  - Incoming: Elevated slate (`bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl rounded-tl-sm`).

### Key User Flows
1. **Chatting & Media**: Tap contact $\rightarrow$ Open conversation $\rightarrow$ Real-time WebSocket delivery $\rightarrow$ Reactions, voice note recorder, document/photo picker $\rightarrow$ Delivery ticks (single tick: sent, double tick: delivered, blue double tick: read if enabled).
2. **Posting a Status**: Tap Status tab $\rightarrow$ "Add Status" modal $\rightarrow$ Text status with background color picker or image upload $\rightarrow$ Contact views status $\rightarrow$ 24-hour expiration countdown.
3. **Simulated Call**: Tap phone/video icon in conversation $\rightarrow$ Full-screen call modal with ringer audio, timer, camera canvas, and audio visualizer $\rightarrow$ End call logs to Calls tab.
4. **Customization & Themes**: Settings $\rightarrow$ Theme Studio $\rightarrow$ Instant live preview of AMOLED Dark, Cyber Violet, or Emerald mode with real-time CSS variable injection.

---

## 3. Key Product Decisions & Trade-Offs

- **Real-Time WebSockets on Port 3000**:
  - *Decision*: Mount `ws` / WebSocket server onto the existing Express server instance.
  - *Why*: Allows true bidirectional client-server event broadcast (message sent, delivered, read receipts, typing state) while keeping deployment simple and robust.
- **Local SQLite / Structured Storage with In-Memory Mock Fallback**:
  - *Decision*: Use persistent local storage with an Express backend API route (`/api/messages`, `/api/contacts`, `/api/status`, `/api/admin`).
  - *Why*: Ensures instant zero-friction boot in the AI Studio container without requiring external database credential provisioning.
- **End-to-End Encryption Concept**:
  - *Decision*: Implement realistic client-side encryption simulation with cryptographic session keys and lock indicators.
  - *Why*: Gives users full visibility into message payload security without blocking browser execution.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CHATNOVA CLIENT (React SPA)                    │
│                                                                        │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────────────┐  │
│  │ Navigation Rail│  │ Active Chat    │  │ Status & Stories Drawer  │  │
│  │ (Chats, Status,│  │ - Bubble Feed  │  │ - 24h Expiry Engine      │  │
│  │  Calls, Config)│  │ - Voice Notes  │  │ - Quick Reply Channel    │  │
│  └───────┬────────┘  │ - E2EE Lock    │  └────────────┬─────────────┘  │
│          │           └───────┬────────┘               │                │
│          ▼                   ▼                        ▼                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                Client State Manager & Socket Client              │  │
│  │  - Optimistic Message Pipeline   - Audio Visualizer Controller   │  │
│  │  - Privacy & Cloaking Filters    - Theme Customization Injector  │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │ HTTP /api/* + WebSocket ws://
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     CHATNOVA SERVER (Node / Express)                   │
│                                                                        │
│  ┌─────────────────────────┐             ┌───────────────────────────┐ │
│  │ Express REST Controller │             │ WebSocket Presence Broker │ │
│  │ - /api/auth             │             │ - heartbeat ping/pong     │ │
│  │ - /api/messages         │             │ - broadcast_message       │ │
│  │ - /api/status           │             │ - typing_indicator        │ │
│  │ - /api/admin/reports    │             │ - call_signaling          │ │
│  └────────────┬────────────┘             └─────────────┬─────────────┘ │
│               │                                        │               │
│               ▼                                        ▼               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   ChatNova Data & Persistence Layer              │  │
│  │  - User Registry & Privacy Rules   - Ephemeral Status Table      │  │
│  │  - Message Store & Audit Logs      - Community Channels          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Entity Schema

1. **Users (`users`)**: `id`, `name`, `handle`, `avatarUrl`, `phone`, `bio`, `onlineStatus`, `lastSeen`, `privacySettings` (hideOnline, hideLastSeen, disableReadReceipts, hideTyping, appLockPin).
2. **Conversations (`conversations`)**: `id`, `type` (direct | group | community), `name`, `avatarUrl`, `pinned`, `archived`, `disappearingDuration`, `encryptionKeyId`, `updatedAt`.
3. **Messages (`messages`)**: `id`, `conversationId`, `senderId`, `content`, `mediaType` (text | image | audio | doc), `mediaUrl`, `status` (sending | sent | delivered | read), `replyToId`, `reactions` (json), `isEdited`, `isDeleted`, `timestamp`.
4. **Status Updates (`statuses`)**: `id`, `userId`, `mediaUrl`, `caption`, `backgroundColor`, `viewers` (array), `createdAt`, `expiresAt` (24h).
5. **Calls (`calls`)**: `id`, `callerId`, `receiverId`, `callType` (voice | video), `status` (missed | answered | rejected), `durationSeconds`, `startedAt`.
6. **Reports & Admin Logs (`admin_reports`)**: `id`, `reportedUserId`, `reporterId`, `reason`, `status` (pending | resolved | suspended), `createdAt`.

---

## 5. Implementation Roadmap

- **Phase 1: Foundation & Theme Engine**: Set up Obsidian AMOLED tokens, typography, audio sound effects, and responsive 5-tab mobile/desktop shell.
- **Phase 2: Conversation & Messaging Hub**: Real-time WebSocket messaging, message bubbles, voice note recording with audio waveform, emoji/reactions, message search, pinned & archived chats.
- **Phase 3: 24-Hour Status Stories**: Ephemeral status creation (photo upload & rich gradient text), story viewer, viewer lists, and private reactions.
- **Phase 4: Simulated Audio/Video Calling**: Incoming/outgoing call modal with realistic ringtone, camera canvas preview, duration timer, and call history log.
- **Phase 5: Granular Privacy & App Lock**: Hide online toggle, read receipt suppression, typing cloak, disappearing timer, and biometric/PIN unlock modal.
- **Phase 6: Admin Dashboard & Cybersecurity**: Platform health monitor, report investigations, account suspensions, and E2EE session key viewer.
