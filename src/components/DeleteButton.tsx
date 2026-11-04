"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { btnDanger } from "@/libs/ui";

// Two-step delete: first click asks, second click confirms
export default function DeleteButton({
  label = "ลบ",
  onDelete,
  redirectTo,
}: {
  label?: string;
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
      setError(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      {confirming ? (
        <>
          <button type="button" disabled={loading} onClick={run} className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50">
            {loading ? "กำลังลบ…" : "ยืนยันการลบ"}
          </button>
          <button type="button" disabled={loading} onClick={() => setConfirming(false)} className="px-2 py-2 text-sm text-neutral-500 hover:text-neutral-900">
            ไม่ลบ
          </button>
        </>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className={btnDanger}>
          {label}
        </button>
      )}
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </span>
  );
}
