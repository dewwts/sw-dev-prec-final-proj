import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getService } from "@/libs/services";
import { formatDuration, formatFee } from "@/libs/format";
import { btnPrimary, btnSecondary } from "@/libs/ui";

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
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/services" className="text-sm text-neutral-400 transition hover:text-neutral-900">&larr; บริการทั้งหมด</Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">{service.name}</h1>
      <p className="mt-4 whitespace-pre-line text-lg leading-8 text-neutral-500">{service.description}</p>

      <dl className="mt-10 grid grid-cols-1 divide-y divide-neutral-100 border-y border-neutral-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="py-5 sm:pr-6">
          <dt className="text-sm text-neutral-400">ระยะเวลาโดยประมาณ</dt>
          <dd className="mt-1 text-xl font-semibold text-neutral-900">{formatDuration(service.estimatedDuration)}</dd>
        </div>
        <div className="py-5 sm:px-6">
          <dt className="text-sm text-neutral-400">ค่าบริการ</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums text-neutral-900">{formatFee(service.serviceFee)}</dd>
        </div>
        <div className="py-5 sm:pl-6">
          <dt className="text-sm text-neutral-400">รหัสแพ็กเกจ</dt>
          <dd className="mt-1 break-all text-xs text-neutral-500">{service._id}</dd>
        </div>
      </dl>

      <div className="mt-10 flex flex-wrap gap-3">
        {role === "member" ? <Link href={`/appointments/new?service=${service._id}`} className={btnPrimary}>จองบริการนี้</Link> : null}
        {role === "admin" ? <Link href={`/admin/services/${service._id}/edit`} className={btnSecondary}>แก้ไขแพ็กเกจ</Link> : null}
        {!session ? (
          <Link href={`/login?callbackUrl=${encodeURIComponent(`/appointments/new?service=${service._id}`)}`} className={btnPrimary}>
            เข้าสู่ระบบเพื่อจอง
          </Link>
        ) : null}
      </div>
    </main>
  );
}
