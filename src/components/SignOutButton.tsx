"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-md border border-white/25 px-3 py-2 text-sm font-semibold text-white transition hover:border-signal hover:bg-signal"
    >
      Sign out
    </button>
  );
}
