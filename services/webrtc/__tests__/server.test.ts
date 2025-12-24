import { WebSocketServer, WebSocket } from "ws";

const buildServer = () => {
  const sessions = new Map<string, Set<WebSocket>>();

  const wss = new WebSocketServer({ port: 0 });

  wss.on("connection", (socket) => {
    let currentSession: Set<WebSocket> | null = null;

    socket.on("message", (data) => {
      const payload = JSON.parse(data.toString()) as { type: string; sessionId?: string };
      if (payload.type === "join" && payload.sessionId) {
        currentSession = sessions.get(payload.sessionId) ?? new Set();
        sessions.set(payload.sessionId, currentSession);
        currentSession.add(socket);
        socket.send(JSON.stringify({ type: "ready" }));
        return;
      }

      if (!currentSession) {
        socket.send(JSON.stringify({ type: "error", message: "Join required." }));
        return;
      }

      currentSession.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
        }
      });
    });
  });

  return wss;
};

test("broadcasts offer to other client in session", (done) => {
  const server = buildServer();
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Missing address");
  }

  const url = `ws://127.0.0.1:${address.port}`;
  const sender = new WebSocket(url);
  const receiver = new WebSocket(url);

  receiver.on("message", (data) => {
    const message = JSON.parse(data.toString()) as { type: string; sdp?: string };
    if (message.type === "offer") {
      expect(message.sdp).toBe("fake-offer");
      sender.close();
      receiver.close();
      server.close();
      done();
    }
  });

  Promise.all([
    new Promise<void>((resolve) => sender.on("open", resolve)),
    new Promise<void>((resolve) => receiver.on("open", resolve))
  ]).then(() => {
    sender.send(JSON.stringify({ type: "join", sessionId: "abc", role: "viewer" }));
    receiver.send(JSON.stringify({ type: "join", sessionId: "abc", role: "streamer" }));
    sender.send(JSON.stringify({ type: "offer", sdp: "fake-offer" }));
  });
});
