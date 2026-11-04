"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function TopMenuItem({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  // "/appointments" has its own "/appointments/new" item, so only highlight it on an exact match
  const active = pathname === href || (href !== "/appointments" && pathname.startsWith(`${href}/`));
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm transition ${active ? "font-medium text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}`}
    >
      {children}
    </Link>
  );
}
