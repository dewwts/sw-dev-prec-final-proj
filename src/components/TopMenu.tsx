import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import TopMenuItem from "./TopMenuItem";
import SignOutButton from "./SignOutButton";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex min-h-16 max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6" aria-label="เมนูหลัก">
        <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-neutral-900">
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" aria-hidden />
          PitStop
        </Link>
        <div className="flex flex-wrap items-center gap-0.5">
          <TopMenuItem href="/services">บริการ</TopMenuItem>
          {role === "admin" ? <TopMenuItem href="/admin/dashboard">แดชบอร์ด</TopMenuItem> : null}
          {role === "member" ? <TopMenuItem href="/appointments/new">จองคิว</TopMenuItem> : null}
          {session ? <TopMenuItem href="/appointments">{role === "admin" ? "นัดหมายทั้งหมด" : "นัดหมายของฉัน"}</TopMenuItem> : null}
          {role === "admin" ? <TopMenuItem href="/admin/services">จัดการบริการ</TopMenuItem> : null}
          <span className="mx-2 hidden h-4 w-px bg-neutral-200 sm:block" aria-hidden />
          {session ? (
            <div className="flex items-center gap-1">
              <span className="px-2 text-sm text-neutral-900">
                {session.user.name}
                <span className="ml-1.5 text-xs text-neutral-400">{role === "admin" ? "ผู้ดูแล" : "สมาชิก"}</span>
              </span>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <TopMenuItem href="/login">เข้าสู่ระบบ</TopMenuItem>
              <Link href="/register" className="rounded-lg bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-neutral-700">
                สมัครสมาชิก
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
