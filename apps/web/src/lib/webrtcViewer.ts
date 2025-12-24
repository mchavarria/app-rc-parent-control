import type { ConnectionStatus } from "./sessionTypes";
import type { SignalingClient, SignalingMessage } from "./signalingClient";

type WebRtcViewerOptions = {
  signaling: SignalingClient;
  peerFactory?: () => RTCPeerConnection;
  onStatus: (status: ConnectionStatus) => void;
  onError: (message: string | null) => void;
};

export class WebRtcViewer {
  private peer: RTCPeerConnection | null = null;
  private unsubscribe: (() => void) | null = null;

  constructor(private readonly options: WebRtcViewerOptions) {}

  async connect(sessionId: string, onTrack: (stream: MediaStream) => void) {
    this.options.onStatus("connecting");
    await this.options.signaling.connect();

    this.unsubscribe = this.options.signaling.onMessage((message) => {
      void this.handleMessage(message);
    });

    const peer = this.options.peerFactory?.() ?? new RTCPeerConnection();
    this.peer = peer;

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        this.options.signaling.send({
          type: "candidate",
          candidate: event.candidate.toJSON()
        });
      }
    };

    peer.ontrack = (event) => {
      if (event.streams[0]) {
        onTrack(event.streams[0]);
      }
    };

    peer.onconnectionstatechange = () => {
      switch (peer.connectionState) {
        case "connected":
          this.options.onStatus("connected");
          break;
        case "disconnected":
          this.options.onStatus("reconnecting");
          break;
        case "failed":
          this.options.onStatus("failed");
          break;
        default:
          break;
      }
    };

    await this.options.signaling.join(sessionId, "viewer");
  }

  async disconnect() {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.peer?.close();
    this.peer = null;
    this.options.signaling.close();
    this.options.onStatus("idle");
    this.options.onError(null);
  }

  private async handleMessage(message: SignalingMessage) {
    if (!this.peer) {
      return;
    }

    try {
      switch (message.type) {
        case "offer": {
          const offer: RTCSessionDescriptionInit = {
            type: "offer",
            sdp: message.sdp
          };
          await this.peer.setRemoteDescription(offer);
          const answer = await this.peer.createAnswer();
          await this.peer.setLocalDescription(answer);
          this.options.signaling.send({
            type: "answer",
            sdp: answer.sdp ?? ""
          });
          this.options.onStatus("connected");
          break;
        }
        case "candidate": {
          await this.peer.addIceCandidate(message.candidate);
          break;
        }
        case "error": {
          this.options.onError(message.message);
          this.options.onStatus("failed");
          break;
        }
        default:
          break;
      }
    } catch (error) {
      this.options.onError(
        error instanceof Error ? error.message : "Failed to handle signaling"
      );
      this.options.onStatus("failed");
    }
  }
}
