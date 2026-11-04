"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { userRegister } from "@/libs/auth";
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
      setError("Please fill in every field.");
      return;
    }
    if (!EMAIL_RE.test(form.email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await userRegister({ ...form, name: form.name.trim(), email: form.email.trim(), tel: form.tel.trim() });
    } catch (err) {
      setLoading(false);
      const message = err instanceof Error ? err.message : "Registration failed";
      // the backend reports a duplicate email as a generic server error
      setError(/duplicate|E11000|Server Error/i.test(message) ? "This email may already be registered." : message);
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
      <TextField label="Name" name="name" fullWidth value={form.name} onChange={(e) => update("name")(e.target.value)} autoComplete="name" />
      <TextField label="Email" name="email" type="email" fullWidth value={form.email} onChange={(e) => update("email")(e.target.value)} autoComplete="email" />
      <TextField label="Telephone" name="tel" fullWidth value={form.tel} onChange={(e) => update("tel")(e.target.value)} autoComplete="tel" />
      <FormControl fullWidth>
        <InputLabel id="role-label">Role</InputLabel>
        <Select labelId="role-label" id="role" name="role" label="Role" value={form.role} onChange={(e) => update("role")(e.target.value)}>
          <MenuItem value="member">Member</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Password"
        name="password"
        type="password"
        fullWidth
        value={form.password}
        onChange={(e) => update("password")(e.target.value)}
        helperText="At least 6 characters"
        autoComplete="new-password"
      />
      {error ? <Alert>{error}</Alert> : null}
      <button type="submit" disabled={loading} className="w-full rounded-md bg-signal py-3 font-semibold text-white transition hover:bg-signal-dark disabled:opacity-60">
        {loading ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-steel">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-signal underline underline-offset-4">Sign in</Link>
      </p>
    </form>
  );
}
