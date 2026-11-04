import Link from "next/link";
import type { ReactNode } from "react";

export default function TopMenuItem({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}
