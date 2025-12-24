"use client";

import { useRouter } from "next/navigation";
import { JoinForm } from "@/components/JoinForm";
import { useViewerSession } from "@/lib/useViewerSession";

export default function JoinPage() {
  const router = useRouter();
  const { status, error, createSession } = useViewerSession();

  return (
    <main>
      <section className="card">
        <h1>Enter session code</h1>
        <p>You'll connect to a live stream once the helper session is active.</p>
        <JoinForm
          isLoading={status === "connecting"}
          error={error}
          onJoin={async (code) => {
            const response = await createSession(code);
            if (response.session) {
              router.push(`/view/${response.session.joinCode}`);
            }
          }}
        />
      </section>
    </main>
  );
}
