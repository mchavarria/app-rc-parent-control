"use client";

import { useParams } from "next/navigation";
import { useRef } from "react";
import { ViewerStatus } from "@/components/ViewerStatus";
import { useViewerSession } from "@/lib/useViewerSession";

export default function ViewerPage() {
  const params = useParams<{ code: string }>();
  const { status, session, connect, disconnect } = useViewerSession();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const code = params.code?.toUpperCase() ?? "";

  return (
    <main>
      <section className="card">
        <h1>Live session</h1>
        <p>Session code: <span className="code">{code}</span></p>
        <ViewerStatus status={status} />

        <div className="video-shell">
          <video ref={videoRef} autoPlay playsInline muted />
        </div>

        <button
          type="button"
          onClick={() => connect(code, videoRef.current)}
          disabled={status === "connecting"}
        >
          {status === "connected" ? "Reconnect" : "Connect"}
        </button>
        <button type="button" onClick={disconnect}>
          Leave session
        </button>

        {session ? (
          <p>Viewer URL: {session.viewerUrl}</p>
        ) : null}
      </section>
    </main>
  );
}
