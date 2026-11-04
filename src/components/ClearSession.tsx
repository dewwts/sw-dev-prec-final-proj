"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// Drops a session whose backend token is no longer valid, so the user can sign in again
export default function ClearSession() {
  const router = useRouter();
  useEffect(() => {
    signOut({ redirect: false }).then(() => router.refresh());
  }, [router]);
  return null;
}
