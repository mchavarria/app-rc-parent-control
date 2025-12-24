# WebRTC Signaling Service

Lightweight WebSocket signaling service for exchanging SDP offers/answers and ICE candidates.

## Run

```sh
pnpm install
pnpm dev
```

Service listens on port 8080 by default. Set `PORT` to override.

## Message format

- Join: `{ "type": "join", "sessionId": "abc", "role": "viewer" }`
- Offer: `{ "type": "offer", "sdp": "..." }`
- Answer: `{ "type": "answer", "sdp": "..." }`
- Candidate: `{ "type": "candidate", "candidate": { ... } }`
