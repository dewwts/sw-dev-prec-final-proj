"use client";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Something went wrong</p>
      <h1 className="mt-2 font-display text-4xl uppercase text-ink">Can&apos;t load this page</h1>
      <p className="mt-4 text-steel">{error.message || "Unexpected error."}</p>
      <p className="mt-2 text-sm text-steel">
        Make sure the backend is running (see <span className="font-mono">BACKEND_URL</span> in .env.local).
      </p>
      <button type="button" onClick={reset} className="mt-8 rounded-md bg-ink px-6 py-3 font-semibold text-white hover:bg-signal">
        Try again
      </button>
    </main>
  );
}
