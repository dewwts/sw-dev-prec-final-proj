"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-lg px-3 py-2 text-sm text-neutral-500 transition hover:text-neutral-900"
    >
      ออกจากระบบ
    </button>
  );
}
