# Codex Project Instructions — Mobile Screen Sharing for Parental Assistance

## What we're building
A mobile app (iOS + Android) that lets an elderly person share their **phone screen as a live stream** to a trusted helper (“parental assistance”), with optional voice chat and session controls.

This repository is intentionally bootstrapped by Codex CLI. Prefer incremental, runnable checkpoints.

## Primary user flows
1. **Elder (Streamer)**: taps “Start Help Session” → grants screen-sharing permission → sees a simple “You are sharing” banner and big “Stop” button.
2. **Helper (Viewer)**: opens a link / logs in → sees the live stream in a web viewer and/or in-app viewer → can request voice call or send lightweight “tap here” guidance.
3. **Trust & Safety**: explicit consent, clear indicators, and easy stop. No hidden background streaming.

## Non-goals (v1)
- Remote control of the device.
- Recording by default.
- Multi-party streams.

## Architecture sketch
- **Capture**: native OS screen capture APIs (iOS ReplayKit; Android MediaProjection).
- **Transport**: WebRTC (preferred for low-latency interactive help).
- **Signaling**: lightweight server (Node/Go) + WebSocket; or managed WebRTC SFU (optional).
- **Identity**: phone number or email magic link; minimize friction.
- **Security**: end-to-end encryption where feasible; at minimum DTLS-SRTP + authenticated signaling + short-lived session tokens.

## Decisions / constraints
- If the stack is cross-platform (React Native), **screen capture must still be implemented with native modules**.
- Keep the UI extremely simple and large-font friendly.
- Include robust permission/edge-case handling: interruptions, app backgrounding, calls, orientation changes.

## Repo conventions
- Put high-level design + decisions in `docs/`.
- Keep “how to run” in top-level `README.md`.
- Add new skills under `skills/` and reference them from tasks when needed.

## How Codex should work in this repo
- Always start by producing a runnable skeleton (build passes) before adding features.
- Prefer small PR-sized steps: scaffold → auth → signaling → WebRTC viewer → capture sender → hardening.
- Write tests where practical (server, signaling), but do not block v1 on exhaustive UI tests.

## Commands Codex may run
- `npm`, `pnpm`, `yarn` (choose one, default to `pnpm`), `node`
- `xcodebuild` (macOS), `gradlew` (Android)
- `docker` for local signaling server
- `lint`, `test`, `format` scripts once defined

## Deliverables
- iOS app
- Android app
- Web viewer prototype (Next.js)
- Signaling service (local + deployable)

## References (for Codex)
- Read and follow the skill docs in `skills/`.
