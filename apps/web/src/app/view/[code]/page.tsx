"use client";

import { useParams } from "next/navigation";
import { ViewerStatus } from "@/components/ViewerStatus";
import { useViewerSession } from "@/lib/useViewerSession";

export default function ViewerPage() {
  const params = useParams<{ code: string }>();
  const { status, session, joinSession, disconnect } = useViewerSession();

  const code = params.code?.toUpperCase() ?? "";

  return (
    <main>
      <section className="card">
        <h1>Live session</h1>
        <p>Session code: <span className="code">{code}</span></p>
        <ViewerStatus status={status} />

        <div className="video-shell">
          <video autoPlay playsInline muted />
        </div>

        <button
          type="button"
          onClick={() => joinSession(code)}
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
