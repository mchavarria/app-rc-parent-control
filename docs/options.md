# Recommendation: Native vs React Native for Screen Sharing

## Reality check
Screen sharing on mobile is *not* “just UI”. The hard part is **OS capture + encoding + real-time transport**.

### iOS
- Screen capture is via **ReplayKit**.
- For real-time streaming, you typically need a broadcast extension and careful handling of lifecycle limits.

### Android
- Screen capture is via **MediaProjection**.
- OEM quirks are common; robust permission and foreground-service handling is required.

## Best option (if you want v1 fast *and* reliable)
### ✅ Native apps (Swift + Kotlin) for the sender
- Maximum access to platform APIs, fewer “bridge” surprises.
- Easiest path to stable ReplayKit/MediaProjection + WebRTC.
- You can still share a lot of code on the server + web viewer.

## What I would pick
- **If the product succeeds, reliability matters more than shared UI code** → start **native** for the sender apps.

## Web viewer prototype
- Use **Next.js + WebRTC** for low-latency viewing.
- If you later need scale (many helpers) or recording, add an **SFU** (managed or self-hosted) and optionally HLS/DASH for playback.
