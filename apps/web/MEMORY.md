# Project Memory

## Decisions
- Use a native SwiftUI iOS sender app scaffolded via XcodeGen configuration in `apps/mobile/ios/project.yml`.
- Keep streaming logic behind a `ScreenShareControlling` protocol; ReplayKit integration is stubbed for now.
- Session model includes `sessionId`, `joinCode`, `expiresAt`, and `viewerUrl` per repo skill guidance.
- Add a native Kotlin/Compose Android sender app scaffolded with Gradle files under `apps/mobile/android`.
- Keep Android streaming logic behind a `ScreenShareController` stub until MediaProjection and WebRTC wiring is ready.
- Add an Android foreground service + notification for visible sharing state on start/stop.
- Build a Next.js web viewer prototype in `apps/web` with join + viewer pages and a stubbed WebRTC hook.

## Assumptions
- WebRTC signaling/service endpoints will be added later; current sender UI uses a local mock session.
- Broadcast extension and SFU details will be handled once signaling and viewer are ready.

## Open Questions
- Preferred signaling endpoint shape (REST vs WebSocket bootstrap)?
- Whether to include ReplayKit Broadcast Extension in this repo now or later?
- Do you want the Android MediaProjection foreground service in this repo now or in a later milestone?

## Next Steps
- Wire session creation to real signaling service.
- Add ReplayKit Broadcast Extension target and handoff to WebRTC sender.
- Implement helper authentication/magic link flow.
- Wire MediaProjection permission request and projection token handling.
- Connect web viewer to real signaling/WebRTC pipeline.
