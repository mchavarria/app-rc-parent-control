# Mobile Screen Sharing for Parental Assistance

This project aims to help elderly users get real-time assistance by streaming their phone screen to a trusted helper.

## Quick start (intended target)
- Mobile sender app: iOS + Android
- Web viewer: Next.js
- Signaling: Node.js WebSocket
- Transport: WebRTC

> This repo is scaffolded using Codex CLI instructions in `AGENTS.md`.

## Folder layout
- `apps/mobile/` — mobile app(s)
- `apps/web/` — web viewer prototype
- `services/webrtc/` — WebRTC signaling service
- `skills/` — reusable guidance for Codex tasks
- `docs/` — architecture notes and decisions

## Setup and run

### WebRTC signaling service

```sh
cd services/webrtc
pnpm install
pnpm dev
```

The server listens on `ws://localhost:8080` by default. Set `PORT` to override.

### Web viewer app

```sh
cd apps/web
pnpm install
NEXT_PUBLIC_SIGNALING_URL=ws://localhost:8080 pnpm dev
```

Open http://localhost:3000 and join a session code.

## Mobile emulator testing

### iOS (Xcode)
1. Open `apps/mobile/ios` in Xcode after running `xcodegen generate`.
2. Select a Simulator device (e.g., iPhone 15).
3. Press Run to launch the app in the simulator.

### Android (Android Studio)
1. Open `apps/mobile/android` in Android Studio and sync Gradle.
2. Create or select an emulator via Device Manager.
3. Press Run to launch the app in the emulator.

## MVP checklist
- [ ] Create a help session (code + share link)
- [ ] Join as helper in web viewer
- [ ] Start/stop screen sharing (clear indicators)
- [ ] Real-time video stream via WebRTC
- [ ] Basic auth + short-lived session tokens
- [ ] Logging + minimal metrics
