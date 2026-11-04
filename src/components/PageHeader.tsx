import type { ReactNode } from "react";

export default function PageHeader({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-10">
      {kicker ? <p className="text-sm text-neutral-400">{kicker}</p> : null}
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">{title}</h1>
      {children ? <div className="mt-3 max-w-2xl leading-7 text-neutral-500">{children}</div> : null}
    </div>
  );
}
