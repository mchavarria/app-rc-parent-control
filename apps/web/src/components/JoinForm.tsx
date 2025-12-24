"use client";

import { useState } from "react";

type Props = {
  onJoin: (code: string) => void;
  isLoading: boolean;
  error: string | null;
};

export function JoinForm({ onJoin, isLoading, error }: Props) {
  const [code, setCode] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onJoin(code);
      }}
    >
      <label htmlFor="code">Session code</label>
      <input
        id="code"
        name="code"
        placeholder="Enter 6-letter code"
        value={code}
        onChange={(event) => setCode(event.target.value)}
      />
      {error ? <p role="alert">{error}</p> : null}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Joining..." : "Join Session"}
      </button>
    </form>
  );
}
