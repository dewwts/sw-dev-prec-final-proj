import Link from "next/link";
import { formatDuration, formatFee } from "@/libs/format";
import { btnPrimary, btnSecondary } from "@/libs/ui";

export default function ServiceCard({ service, role }: { service: ServiceItem; role?: string }) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-400">
      <Link href={`/services/${service._id}`} className="after:absolute after:inset-0">
        <h3 className="text-lg font-semibold text-neutral-900">{service.name}</h3>
      </Link>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-neutral-500">{service.description}</p>
      <div className="mt-6 flex items-end justify-between">
        <span className="text-sm text-neutral-400">{formatDuration(service.estimatedDuration)}</span>
        <span className="text-xl font-semibold tabular-nums text-neutral-900">{formatFee(service.serviceFee)}</span>
      </div>
      {role === "member" ? (
        <Link href={`/appointments/new?service=${service._id}`} className={`${btnPrimary} relative z-10 mt-5 w-full`}>
          จองบริการนี้
        </Link>
      ) : null}
      {role === "admin" ? (
        <Link href={`/admin/services/${service._id}/edit`} className={`${btnSecondary} relative z-10 mt-5 w-full`}>
          แก้ไขแพ็กเกจ
        </Link>
      ) : null}
    </article>
  );
}
