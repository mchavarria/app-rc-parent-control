export type SignalingRole = "viewer" | "streamer";

export type SignalingMessage =
  | { type: "offer"; sdp: string }
  | { type: "answer"; sdp: string }
  | { type: "candidate"; candidate: RTCIceCandidateInit }
  | { type: "ready" }
  | { type: "error"; message: string };

type MessageHandler = (message: SignalingMessage) => void;

export interface SignalingClient {
  connect(): Promise<void>;
  join(sessionId: string, role: SignalingRole): Promise<void>;
  send(message: SignalingMessage): void;
  onMessage(handler: MessageHandler): () => void;
  close(): void;
}

export class WebSocketSignalingClient implements SignalingClient {
  private socket: WebSocket | null = null;
  private handlers: MessageHandler[] = [];

  constructor(private readonly url: string | undefined) {}

  async connect(): Promise<void> {
    if (!this.url) {
      throw new Error("Signaling endpoint not configured.");
    }

    if (this.socket) {
      return;
    }

    this.socket = new WebSocket(this.url);

    await new Promise<void>((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("WebSocket not initialized"));
        return;
      }
      this.socket.onopen = () => resolve();
      this.socket.onerror = () => reject(new Error("Failed to connect signaling"));
    });

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as SignalingMessage;
        this.handlers.forEach((handler) => handler(message));
      } catch {
        // Ignore malformed payloads.
      }
    };
  }

  async join(sessionId: string, role: SignalingRole): Promise<void> {
    this.send({ type: "ready" });
    this.socket?.send(JSON.stringify({ type: "join", sessionId, role }));
  }

  send(message: SignalingMessage): void {
    this.socket?.send(JSON.stringify(message));
  }

  onMessage(handler: MessageHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((item) => item !== handler);
    };
  }

  close(): void {
    this.socket?.close();
    this.socket = null;
    this.handlers = [];
  }
}
