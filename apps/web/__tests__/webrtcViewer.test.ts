import { WebRtcViewer } from "@/lib/webrtcViewer";
import type { SignalingClient, SignalingMessage } from "@/lib/signalingClient";

type Handler = (message: SignalingMessage) => void;

class MockSignalingClient implements SignalingClient {
  public sent: SignalingMessage[] = [];
  private handler: Handler | null = null;

  async connect(): Promise<void> {}

  async join(): Promise<void> {}

  send(message: SignalingMessage): void {
    this.sent.push(message);
  }

  onMessage(handler: Handler): () => void {
    this.handler = handler;
    return () => {
      this.handler = null;
    };
  }

  close(): void {}

  emit(message: SignalingMessage) {
    this.handler?.(message);
  }
}

class FakePeerConnection {
  public connectionState: RTCPeerConnectionState = "new";
  public onicecandidate: ((event: RTCPeerConnectionIceEvent) => void) | null = null;
  public ontrack: ((event: RTCTrackEvent) => void) | null = null;
  public onconnectionstatechange: (() => void) | null = null;
  public localDescription: RTCSessionDescriptionInit | null = null;
  public remoteDescription: RTCSessionDescriptionInit | null = null;

  async setRemoteDescription(desc: RTCSessionDescriptionInit) {
    this.remoteDescription = desc;
  }

  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    return { type: "answer", sdp: "fake-answer" };
  }

  async setLocalDescription(desc: RTCSessionDescriptionInit) {
    this.localDescription = desc;
  }

  async addIceCandidate(_: RTCIceCandidateInit) {}

  close() {}
}

describe("WebRtcViewer", () => {
  it("sends answer when offer received", async () => {
    const signaling = new MockSignalingClient();
    const statuses: string[] = [];
    const viewer = new WebRtcViewer({
      signaling,
      peerFactory: () => new FakePeerConnection() as unknown as RTCPeerConnection,
      onStatus: (status) => statuses.push(status),
      onError: () => {}
    });

    await viewer.connect("session-1", () => {});

    signaling.emit({ type: "offer", sdp: "fake-offer" });

    expect(signaling.sent).toContainEqual({ type: "answer", sdp: "fake-answer" });
    expect(statuses).toContain("connected");
  });

  it("updates status to failed on error message", async () => {
    const signaling = new MockSignalingClient();
    const statuses: string[] = [];
    const viewer = new WebRtcViewer({
      signaling,
      peerFactory: () => new FakePeerConnection() as unknown as RTCPeerConnection,
      onStatus: (status) => statuses.push(status),
      onError: () => {}
    });

    await viewer.connect("session-2", () => {});

    signaling.emit({ type: "error", message: "bad" });

    expect(statuses).toContain("failed");
  });
});
