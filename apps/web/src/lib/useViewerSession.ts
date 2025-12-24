import { useCallback, useState } from "react";
import type { ConnectionStatus, ShareSession } from "./sessionTypes";

type JoinResponse = {
  status: ConnectionStatus;
  session: ShareSession | null;
};

const mockSession = (code: string): ShareSession => ({
  sessionId: `session-${code}`,
  joinCode: code,
  expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  viewerUrl: `https://example.com/join/${code}`
});

export function useViewerSession() {
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [session, setSession] = useState<ShareSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const joinSession = useCallback(async (code: string): Promise<JoinResponse> => {
    if (!code.trim()) {
      setError("Enter a session code.");
      setStatus("failed");
      return { status: "failed", session: null };
    }

    setError(null);
    setStatus("connecting");

    // Placeholder: replace with signaling/WebRTC handshake.
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newSession = mockSession(code.trim().toUpperCase());
    setSession(newSession);
    setStatus("connected");
    return { status: "connected", session: newSession };
  }, []);

  const disconnect = useCallback(() => {
    setStatus("idle");
    setSession(null);
    setError(null);
  }, []);

  return {
    status,
    session,
    error,
    joinSession,
    disconnect
  };
}
