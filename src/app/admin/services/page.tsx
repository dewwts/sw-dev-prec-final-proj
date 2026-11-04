import Link from "next/link";
import Alert from "@/components/Alert";
import PageHeader from "@/components/PageHeader";
import ServiceDeleteButton from "@/components/ServiceDeleteButton";
import { formatDuration, formatFee } from "@/libs/format";
import requireSession from "@/libs/requireSession";
import { getServices } from "@/libs/services";

export default async function AdminServicesPage({ searchParams }: { searchParams: Promise<{ created?: string; updated?: string }> }) {
  await requireSession("/admin/services", "admin");
  const { created, updated } = await searchParams;
  const services = await getServices();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8">
      <PageHeader kicker="Admin" title="Manage services">
        Add, edit or delete service packages. Deleted packages stop being bookable, but existing appointments keep them.
      </PageHeader>
      <div className="mb-6 space-y-3">
        {created ? <Alert kind="success">Service package added.</Alert> : null}
        {updated ? <Alert kind="success">Service package updated.</Alert> : null}
      </div>
      <Link href="/admin/services/new" className="mb-8 inline-block rounded-md bg-signal px-5 py-2.5 text-sm font-semibold text-white hover:bg-signal-dark">
        + Add service package
      </Link>

      {services.count === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/20 p-10 text-center text-steel">No service packages yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-ink text-white">
              <tr>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest">Package</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest">ID</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest">Duration</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest">Fee</th>
                <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.data.map((s) => (
                <tr key={s._id} className="border-t border-ink/10 align-top">
                  <td className="px-4 py-4">
                    <Link href={`/services/${s._id}`} className="font-semibold text-ink hover:text-signal">{s.name}</Link>
                    <p className="mt-1 line-clamp-2 max-w-sm text-steel">{s.description}</p>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-steel">{s._id}</td>
                  <td className="px-4 py-4 font-mono">{formatDuration(s.estimatedDuration)}</td>
                  <td className="px-4 py-4 font-mono font-semibold text-signal">{formatFee(s.serviceFee)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/admin/services/${s._id}/edit`} className="rounded-md border border-ink px-4 py-2 text-sm font-semibold text-ink hover:bg-ink hover:text-white">
                        Edit
                      </Link>
                      <ServiceDeleteButton id={s._id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
