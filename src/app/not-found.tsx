import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">404</p>
      <h1 className="mt-2 font-display text-4xl uppercase text-ink">Not found</h1>
      <p className="mt-4 text-steel">This page, package or appointment doesn&apos;t exist, or you can&apos;t see it.</p>
      <Link href="/" className="mt-8 inline-block rounded-md bg-ink px-6 py-3 font-semibold text-white hover:bg-signal">Back home</Link>
    </main>
  );
}
