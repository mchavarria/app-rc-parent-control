# skill.webrtc-streaming.md — WebRTC decisions & patterns

## When to use WebRTC
Use WebRTC for **interactive, low-latency** help (target < 1s latency).

## Topologies
1. **P2P (direct)**: simplest infra, worst NAT traversal + mobile reliability.
2. **SFU (recommended)**: mobile sends once; viewers receive. Scales better, simplifies NAT.
3. **MCU**: unnecessary for v1.

## Minimal signaling
- Create session -> returns `sessionId` + short-lived token
- Viewer joins -> exchange SDP offers/answers and ICE candidates via WebSocket

## Security baseline
- DTLS-SRTP is standard in WebRTC for media encryption
- Protect signaling with auth + short-lived session tokens
- Rotate tokens on reconnect; expire sessions automatically

## Operational checklist
- TURN server for hard NAT cases
- Metrics: connected sessions, ICE failures, avg bitrate, packet loss
- Backpressure: cap resolution/bitrate for low-end devices
