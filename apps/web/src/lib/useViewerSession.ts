import { useCallback, useMemo, useRef, useState } from "react";
import type { ConnectionStatus, ShareSession } from "./sessionTypes";
import { WebSocketSignalingClient } from "./signalingClient";
import { WebRtcViewer } from "./webrtcViewer";

type JoinResponse = {
  session: ShareSession | null;
};

const mockSession = (code: string): ShareSession => ({
  sessionId: `session-${code}`,
  joinCode: code,
  expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  viewerUrl: `https://example.com/join/${code}`
});

type ViewerOptions = {
  signalingUrl?: string;
  signalingClient?: WebSocketSignalingClient;
  peerFactory?: () => RTCPeerConnection;
};

export function useViewerSession(options: ViewerOptions = {}) {
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [session, setSession] = useState<ShareSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const viewerRef = useRef<WebRtcViewer | null>(null);

  const signalingClient = useMemo(() => {
    if (options.signalingClient) {
      return options.signalingClient;
    }
    return new WebSocketSignalingClient(
      options.signalingUrl ?? process.env.NEXT_PUBLIC_SIGNALING_URL
    );
  }, [options.signalingClient, options.signalingUrl]);

  const ensureViewer = useCallback(() => {
    if (!viewerRef.current) {
      viewerRef.current = new WebRtcViewer({
        signaling: signalingClient,
        peerFactory: options.peerFactory,
        onStatus: setStatus,
        onError: setError
      });
    }
    return viewerRef.current;
  }, [options.peerFactory, signalingClient]);

  const createSession = useCallback(async (code: string): Promise<JoinResponse> => {
    if (!code.trim()) {
      setError("Enter a session code.");
      setStatus("failed");
      return { session: null };
    }

    setError(null);
    const newSession = mockSession(code.trim().toUpperCase());
    setSession(newSession);
    return { session: newSession };
  }, []);

  const connect = useCallback(
    async (code: string, videoElement?: HTMLVideoElement | null) => {
      const response = await createSession(code);
      if (!response.session) {
        return;
      }

      try {
        const viewer = ensureViewer();
        await viewer.connect(response.session.sessionId, (stream) => {
          if (videoElement) {
            videoElement.srcObject = stream;
          }
        });
      } catch (connectError) {
        setError(
          connectError instanceof Error ? connectError.message : "Unable to connect."
        );
        setStatus("failed");
      }
    },
    [createSession, ensureViewer]
  );

  const disconnect = useCallback(async () => {
    await viewerRef.current?.disconnect();
    setSession(null);
  }, []);

  return {
    status,
    session,
    error,
    createSession,
    connect,
    disconnect
  };
}
