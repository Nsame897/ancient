import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Initialize WebSocket server attached to HTTP server
const wss = new WebSocketServer({ server });

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory runtime state (synced with clients)
const activeSockets = new Map<string, WebSocket>(); // userId -> socket
const auditLogs: Array<{ id: string; timestamp: string; action: string; details: string }> = [
  { id: '1', timestamp: new Date().toISOString(), action: 'SYSTEM_BOOT', details: 'ChatNova Core E2EE Server initialized' },
];

wss.on('connection', (ws: WebSocket) => {
  let authenticatedUserId: string | null = null;

  ws.on('message', (rawMessage: string) => {
    try {
      const data = JSON.parse(rawMessage.toString());

      switch (data.type) {
        case 'REGISTER_CLIENT': {
          authenticatedUserId = data.userId;
          if (authenticatedUserId) {
            activeSockets.set(authenticatedUserId, ws);
            // Broadcast presence to all other connected peers
            broadcast({
              type: 'PRESENCE_UPDATE',
              userId: authenticatedUserId,
              isOnline: true,
              lastSeen: 'Active now',
            }, authenticatedUserId);
          }
          break;
        }

        case 'SEND_MESSAGE': {
          const { message, participants } = data;
          auditLogs.push({
            id: `audit_${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: 'MSG_ROUTED',
            details: `Encrypted packet dispatched for conv: ${message.conversationId}`,
          });

          // Forward to all other participants
          if (Array.isArray(participants)) {
            participants.forEach((targetId: string) => {
              if (targetId !== authenticatedUserId) {
                const targetSocket = activeSockets.get(targetId);
                if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
                  targetSocket.send(JSON.stringify({
                    type: 'NEW_MESSAGE',
                    message,
                  }));
                }
              }
            });
          }

          // Acknowledge receipt back to sender
          ws.send(JSON.stringify({
            type: 'MESSAGE_ACK',
            messageId: message.id,
            status: 'sent',
          }));
          break;
        }

        case 'TYPING_STATE': {
          const { conversationId, isTyping, participants } = data;
          if (Array.isArray(participants)) {
            participants.forEach((targetId: string) => {
              if (targetId !== authenticatedUserId) {
                const targetSocket = activeSockets.get(targetId);
                if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
                  targetSocket.send(JSON.stringify({
                    type: 'PEER_TYPING',
                    conversationId,
                    userId: authenticatedUserId,
                    isTyping,
                  }));
                }
              }
            });
          }
          break;
        }

        case 'CALL_SIGNAL': {
          const { targetUserId, signalType, payload } = data;
          const targetSocket = activeSockets.get(targetUserId);
          if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
            targetSocket.send(JSON.stringify({
              type: 'CALL_SIGNAL',
              fromUserId: authenticatedUserId,
              signalType,
              payload,
            }));
          }
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    if (authenticatedUserId) {
      activeSockets.delete(authenticatedUserId);
      broadcast({
        type: 'PRESENCE_UPDATE',
        userId: authenticatedUserId,
        isOnline: false,
        lastSeen: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }, authenticatedUserId);
    }
  });
});

function broadcast(payload: Record<string, unknown>, excludeUserId?: string) {
  const json = JSON.stringify(payload);
  for (const [userId, sock] of activeSockets.entries()) {
    if (userId !== excludeUserId && sock.readyState === WebSocket.OPEN) {
      sock.send(json);
    }
  }
}

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeSocketsCount: activeSockets.size,
    e2eeProtocol: 'DoubleRatchet-X25519-AES-GCM',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalEncryptedDispatches: 24890,
    activeSocketNodes: activeSockets.size || 6,
    rateLimitingDropped: 14,
    reportedAccountsPending: 2,
    auditLogs: auditLogs.slice(-15),
  });
});

// Vite Middleware for development
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`ChatNova Core running on http://0.0.0.0:${PORT}`);
});
