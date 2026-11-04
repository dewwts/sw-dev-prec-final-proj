"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextField } from "@mui/material";
import Alert from "./Alert";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <TextField label="Email" name="email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      <TextField label="Password" name="password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      {error ? <Alert>{error}</Alert> : null}
      <button type="submit" disabled={loading} className="w-full rounded-md bg-ink py-3 font-semibold text-white transition hover:bg-signal disabled:opacity-60">
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-steel">
        No account yet?{" "}
        <Link href="/register" className="font-semibold text-signal underline underline-offset-4">Register</Link>
      </p>
    </form>
  );
}
