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
- `services/signaling/` — signaling/auth/session service
- `skills/` — reusable guidance for Codex tasks
- `docs/` — architecture notes and decisions

## MVP checklist
- [ ] Create a help session (code + share link)
- [ ] Join as helper in web viewer
- [ ] Start/stop screen sharing (clear indicators)
- [ ] Real-time video stream via WebRTC
- [ ] Basic auth + short-lived session tokens
- [ ] Logging + minimal metrics
