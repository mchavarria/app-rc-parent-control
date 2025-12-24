import { WebSocketServer, WebSocket } from "ws";

const PORT = Number(process.env.PORT ?? 8080);

type JoinPayload = {
  type: "join";
  sessionId: string;
  role: "viewer" | "streamer";
};

type SignalPayload =
  | { type: "offer"; sdp: string }
  | { type: "answer"; sdp: string }
  | { type: "candidate"; candidate: RTCIceCandidateInit };

type ClientMessage = JoinPayload | SignalPayload;

type Session = {
  clients: Set<WebSocket>;
};

const sessions = new Map<string, Session>();

function getSession(sessionId: string): Session {
  const existing = sessions.get(sessionId);
  if (existing) {
    return existing;
  }
  const created = { clients: new Set<WebSocket>() };
  sessions.set(sessionId, created);
  return created;
}

function broadcast(session: Session, sender: WebSocket, payload: SignalPayload) {
  const message = JSON.stringify(payload);
  session.clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (socket) => {
  let currentSession: Session | null = null;

  socket.on("message", (data) => {
    try {
      const parsed = JSON.parse(data.toString()) as ClientMessage;
      if (parsed.type === "join") {
        currentSession = getSession(parsed.sessionId);
        currentSession.clients.add(socket);
        socket.send(JSON.stringify({ type: "ready" }));
        return;
      }

      if (!currentSession) {
        socket.send(JSON.stringify({ type: "error", message: "Join required." }));
        return;
      }

      broadcast(currentSession, socket, parsed);
    } catch {
      socket.send(JSON.stringify({ type: "error", message: "Invalid payload" }));
    }
  });

  socket.on("close", () => {
    if (!currentSession) {
      return;
    }
    currentSession.clients.delete(socket);
    if (currentSession.clients.size === 0) {
      for (const [key, value] of sessions.entries()) {
        if (value === currentSession) {
          sessions.delete(key);
          break;
        }
      }
    }
  });
});

console.log(`Signaling server listening on ${PORT}`);
