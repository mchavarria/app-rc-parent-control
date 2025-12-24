# Web Viewer Prototype

Next.js web viewer for joining a help session and displaying a live stream.

## Run

```sh
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Notes
- WebRTC signaling is stubbed in `useViewerSession` and should be replaced with WebSocket signaling.
