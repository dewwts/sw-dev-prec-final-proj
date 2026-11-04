import type { ReactNode } from "react";

export default function PageHeader({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-signal">{kicker}</p>
      <h1 className="mt-2 font-display text-4xl uppercase leading-none tracking-tight text-ink sm:text-5xl">{title}</h1>
      {children ? <div className="mt-4 max-w-2xl text-steel">{children}</div> : null}
    </div>
  );
}
