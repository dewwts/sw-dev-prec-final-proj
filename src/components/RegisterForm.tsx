"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { userRegister } from "@/libs/auth";
import { btnPrimary, link } from "@/libs/ui";
import Alert from "./Alert";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterInput>({ name: "", email: "", tel: "", role: "member", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: keyof RegisterInput) => (value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.tel.trim() || !form.password) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    if (!EMAIL_RE.test(form.email)) {
      setError("รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }
    if (form.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    setLoading(true);
    try {
      await userRegister({ ...form, name: form.name.trim(), email: form.email.trim(), tel: form.tel.trim() });
    } catch (err) {
      setLoading(false);
      const message = err instanceof Error ? err.message : "สมัครสมาชิกไม่สำเร็จ";
      // the backend reports a duplicate email as a generic server error
      setError(/duplicate|E11000|Server Error/i.test(message) ? "อีเมลนี้อาจถูกใช้สมัครไปแล้ว" : message);
      return;
    }
    // sign in straight away with the new account
    const result = await signIn("credentials", { email: form.email.trim(), password: form.password, redirect: false });
    setLoading(false);
    if (!result || result.error) {
      router.push("/login");
      return;
    }
    router.push(form.role === "admin" ? "/admin/services" : "/services");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <TextField label="ชื่อ" name="name" fullWidth value={form.name} onChange={(e) => update("name")(e.target.value)} autoComplete="name" />
      <TextField label="อีเมล" name="email" type="email" fullWidth value={form.email} onChange={(e) => update("email")(e.target.value)} autoComplete="email" />
      <TextField label="เบอร์โทรศัพท์" name="tel" fullWidth value={form.tel} onChange={(e) => update("tel")(e.target.value)} autoComplete="tel" />
      <FormControl fullWidth>
        <InputLabel id="role-label">ประเภทบัญชี</InputLabel>
        <Select labelId="role-label" id="role" name="role" label="ประเภทบัญชี" value={form.role} onChange={(e) => update("role")(e.target.value)}>
          <MenuItem value="member">สมาชิก (member)</MenuItem>
          <MenuItem value="admin">ผู้ดูแลระบบ (admin)</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="รหัสผ่าน"
        name="password"
        type="password"
        fullWidth
        value={form.password}
        onChange={(e) => update("password")(e.target.value)}
        helperText="อย่างน้อย 6 ตัวอักษร"
        autoComplete="new-password"
      />
      {error ? <Alert>{error}</Alert> : null}
      <button type="submit" disabled={loading} className={`${btnPrimary} w-full py-3`}>
        {loading ? "กำลังสร้างบัญชี…" : "สมัครสมาชิก"}
      </button>
      <p className="text-center text-sm text-neutral-500">
        มีบัญชีอยู่แล้ว? <Link href="/login" className={link}>เข้าสู่ระบบ</Link>
      </p>
    </form>
  );
}
