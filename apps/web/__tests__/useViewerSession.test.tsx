import { renderHook, act } from "@testing-library/react";
import { useViewerSession } from "@/lib/useViewerSession";

describe("useViewerSession", () => {
  it("fails when code is empty", async () => {
    const { result } = renderHook(() => useViewerSession());

    await act(async () => {
      await result.current.createSession("");
    });

    expect(result.current.status).toBe("failed");
    expect(result.current.error).toBe("Enter a session code.");
  });

  it("creates session when code provided", async () => {
    const { result } = renderHook(() => useViewerSession());

    await act(async () => {
      await result.current.createSession("abc123");
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.session?.joinCode).toBe("ABC123");
  });
});
