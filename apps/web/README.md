# Web Viewer Prototype

Next.js web viewer for joining a help session and displaying a live stream.

## Run

```sh
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Notes
- WebRTC signaling uses a WebSocket client and expects `NEXT_PUBLIC_SIGNALING_URL` to be set.
- The signaling service lives in `services/webrtc`.
