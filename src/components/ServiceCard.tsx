import Link from "next/link";
import { formatDuration, formatFee } from "@/libs/format";

export default function ServiceCard({ service, role }: { service: ServiceItem; role?: string }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="h-1 w-full bg-ink transition group-hover:bg-signal" aria-hidden />
      <div className="flex flex-1 flex-col p-6">
        <Link href={`/services/${service._id}`} className="after:absolute after:inset-0">
          <h3 className="font-display text-xl uppercase leading-tight text-ink">{service.name}</h3>
        </Link>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-steel">{service.description}</p>
        <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-dashed border-ink/15 pt-4">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">Duration</dt>
            <dd className="font-mono text-sm font-semibold text-ink">{formatDuration(service.estimatedDuration)}</dd>
          </div>
          <div className="text-right">
            <dt className="font-mono text-[10px] uppercase tracking-widest text-steel">Fee</dt>
            <dd className="font-mono text-lg font-bold text-signal">{formatFee(service.serviceFee)}</dd>
          </div>
        </dl>
        {role === "member" ? (
          <Link
            href={`/appointments/new?service=${service._id}`}
            className="relative z-10 mt-5 rounded-md bg-ink py-2.5 text-center text-sm font-semibold text-white transition hover:bg-signal"
          >
            Book this service
          </Link>
        ) : null}
        {role === "admin" ? (
          <Link
            href={`/admin/services/${service._id}/edit`}
            className="relative z-10 mt-5 rounded-md border border-ink py-2.5 text-center text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
          >
            Edit package
          </Link>
        ) : null}
      </div>
    </article>
  );
}
