# skill.mobile-architecture.md — Mobile sender app blueprint

## Goal
Build iOS + Android apps that can start/stop screen capture and stream it to a helper with minimal friction.

## Key components
- Session model: `sessionId`, `joinCode`, `expiresAt`, `viewerUrl`
- Permissions:
  - iOS: ReplayKit permissions + broadcast extension setup
  - Android: MediaProjection permission + foreground service notification
- Transport: WebRTC sender (DTLS-SRTP) to an SFU or direct P2P (start with SFU if possible)
- UX:
  - Big “Start sharing” / “Stop” buttons
  - Always-visible “Sharing” indicator
  - Reconnect logic + clear error messages

## Implementation notes
- Keep streaming pipeline native even if UI is cross-platform.
- Handle interruptions:
  - incoming call, screen lock, backgrounding
  - network drop / resume
- Produce logs useful for debugging: capture state, ICE state, bitrate, packet loss.

## Definition of done
- Start a session and stream visible screen frames to a known viewer
- Stop streaming cleanly and revoke tokens
- No silent streaming: indicators are always shown
