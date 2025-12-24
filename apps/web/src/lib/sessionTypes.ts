export type ConnectionStatus = "idle" | "connecting" | "connected" | "reconnecting" | "failed";

export type ShareSession = {
  sessionId: string;
  joinCode: string;
  expiresAt: string;
  viewerUrl: string;
};
