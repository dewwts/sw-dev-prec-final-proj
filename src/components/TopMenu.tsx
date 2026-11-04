import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import TopMenuItem from "./TopMenuItem";
import SignOutButton from "./SignOutButton";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  return (
    <header className="sticky top-0 z-40 bg-ink text-white">
      <div className="hazard h-1.5 w-full" aria-hidden />
      <nav className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-8" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-signal font-display text-lg leading-none">P</span>
          <span className="font-display text-lg tracking-wide">PITSTOP</span>
        </Link>
        <div className="flex flex-wrap items-center gap-1">
          <TopMenuItem href="/services">Services</TopMenuItem>
          {role === "member" ? <TopMenuItem href="/appointments/new">Book</TopMenuItem> : null}
          {session ? (
            <TopMenuItem href="/appointments">{role === "admin" ? "All Appointments" : "My Appointments"}</TopMenuItem>
          ) : null}
          {role === "admin" ? <TopMenuItem href="/admin/services">Manage Services</TopMenuItem> : null}
          <span className="mx-2 hidden h-6 w-px bg-white/20 sm:block" aria-hidden />
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70">
                {session.user.name}
                <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal">
                  {role}
                </span>
              </span>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <TopMenuItem href="/login">Sign in</TopMenuItem>
              <Link href="/register" className="rounded-md bg-signal px-3 py-2 text-sm font-semibold text-white transition hover:bg-signal-dark">
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
