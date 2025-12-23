# skill.web-viewer-prototype.md — Prototype web interface for viewing streams

## Goal
A web app that can join a help session and display the live stream with minimal latency.

## Recommended stack
- **Next.js (React)**
- WebRTC in the browser:
  - Use `RTCPeerConnection`
  - Render with `<video autoplay playsinline />`
- Signaling over WebSocket to the signaling service

## MVP UI
- Join page: session code + optional password
- Viewer page: video player + connection status
- Optional: “Request voice call” button (v2)

## Definition of done
- Viewer can join and see video
- Displays connection state (connecting/connected/reconnecting/failed)
- Handles reconnect without reload (best-effort)
