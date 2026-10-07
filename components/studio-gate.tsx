"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function StudioGate({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const response = await fetch("/api/studio/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const body: unknown = await response.json().catch(() => null);
    setPending(false);
    if (!response.ok) {
      const message =
        body &&
        typeof body === "object" &&
        "error" in body &&
        typeof body.error === "string"
          ? body.error
          : "The studio did not open.";
      setError(message);
      return;
    }
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-5 py-20">
      <p className="text-xs uppercase tracking-[0.24em] text-gold">Studio</p>
      <h1 className="mt-3 font-display text-5xl tracking-tight">Open the bench</h1>
      <p className="mt-4 text-muted">
        Drop jewelry photos here. The model writes the ad, then you publish it
        onto the gallery.
      </p>
      {configured ? (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            Studio password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3"
              required
            />
          </label>
          {error ? <p className="text-sm text-clay">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-ink px-5 py-3 text-sm text-card disabled:opacity-60"
          >
            {pending ? "Opening…" : "Enter"}
          </button>
        </form>
      ) : (
        <p className="mt-8 rounded-2xl bg-card p-4 text-sm leading-relaxed">
          Set <code>STUDIO_PASSWORD</code> in <code>.env.local</code>, then
          restart the dev server.
        </p>
      )}
    </main>
  );
}
