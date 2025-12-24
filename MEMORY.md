# Project Memory

## Decisions
- Use a native SwiftUI iOS sender app scaffolded via XcodeGen configuration in `apps/mobile/ios/project.yml`.
- Keep streaming logic behind a `ScreenShareControlling` protocol; ReplayKit integration is stubbed for now.
- Session model includes `sessionId`, `joinCode`, `expiresAt`, and `viewerUrl` per repo skill guidance.

## Assumptions
- WebRTC signaling/service endpoints will be added later; current sender UI uses a local mock session.
- Broadcast extension and SFU details will be handled once signaling and viewer are ready.

## Open Questions
- Preferred signaling endpoint shape (REST vs WebSocket bootstrap)?
- Whether to include ReplayKit Broadcast Extension in this repo now or later?

## Next Steps
- Wire session creation to real signaling service.
- Add ReplayKit Broadcast Extension target and handoff to WebRTC sender.
- Implement helper authentication/magic link flow.
