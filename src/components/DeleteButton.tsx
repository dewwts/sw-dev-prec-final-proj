"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Two-step delete: first click asks, second click confirms
export default function DeleteButton({
  label,
  onDelete,
  redirectTo,
}: {
  label: string;
  onDelete: () => Promise<unknown>;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      await onDelete();
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      {confirming ? (
        <>
          <button type="button" disabled={loading} onClick={run} className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60">
            {loading ? "Deleting…" : "Confirm delete"}
          </button>
          <button type="button" disabled={loading} onClick={() => setConfirming(false)} className="rounded-md px-3 py-2 text-sm font-semibold text-steel hover:text-ink">
            Keep
          </button>
        </>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className="rounded-md border border-red-700 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
          {label}
        </button>
      )}
      {error ? <span className="text-sm text-red-700">{error}</span> : null}
    </span>
  );
}
