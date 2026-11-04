import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getService } from "@/libs/services";
import { formatDuration, formatFee } from "@/libs/format";

export default async function ServiceDetailPage({ params }: { params: Promise<{ sid: string }> }) {
  const { sid } = await params;
  const session = await getServerSession(authOptions);
  let service: ServiceItem;
  try {
    service = (await getService(sid)).data;
  } catch {
    notFound();
  }
  const role = session?.user?.role;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-8">
      <Link href="/services" className="text-sm font-semibold text-steel hover:text-signal">&larr; All services</Link>
      <article className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
        <div className="hazard h-2" aria-hidden />
        <div className="p-8 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Service package</p>
          <h1 className="mt-2 font-display text-4xl uppercase leading-none text-ink">{service.name}</h1>
          <p className="mt-6 whitespace-pre-line leading-7 text-steel">{service.description}</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-paper p-4">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">Estimated duration</dt>
              <dd className="mt-1 font-mono text-xl font-bold text-ink">{formatDuration(service.estimatedDuration)}</dd>
            </div>
            <div className="rounded-lg bg-paper p-4">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">Service fee</dt>
              <dd className="mt-1 font-mono text-xl font-bold text-signal">{formatFee(service.serviceFee)}</dd>
            </div>
            <div className="rounded-lg bg-paper p-4">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">Package ID</dt>
              <dd className="mt-1 break-all font-mono text-xs text-ink">{service._id}</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            {role === "member" ? (
              <Link href={`/appointments/new?service=${service._id}`} className="rounded-md bg-ink px-6 py-3 font-semibold text-white hover:bg-signal">
                Book this service
              </Link>
            ) : null}
            {role === "admin" ? (
              <Link href={`/admin/services/${service._id}/edit`} className="rounded-md border border-ink px-6 py-3 font-semibold text-ink hover:bg-ink hover:text-white">
                Edit package
              </Link>
            ) : null}
            {!session ? (
              <Link href={`/login?callbackUrl=${encodeURIComponent(`/appointments/new?service=${service._id}`)}`} className="rounded-md bg-ink px-6 py-3 font-semibold text-white hover:bg-signal">
                Sign in to book
              </Link>
            ) : null}
          </div>
        </div>
      </article>
    </main>
  );
}
