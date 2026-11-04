"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextField } from "@mui/material";
import { btnPrimary, link } from "@/libs/ui";
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
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (!result || result.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <TextField label="อีเมล" name="email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      <TextField label="รหัสผ่าน" name="password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      {error ? <Alert>{error}</Alert> : null}
      <button type="submit" disabled={loading} className={`${btnPrimary} w-full py-3`}>
        {loading ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
      </button>
      <p className="text-center text-sm text-neutral-500">
        ยังไม่มีบัญชี? <Link href="/register" className={link}>สมัครสมาชิก</Link>
      </p>
    </form>
  );
}
