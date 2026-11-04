import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ServiceDeleteButton from "@/components/ServiceDeleteButton";
import ServiceForm from "@/components/ServiceForm";
import requireSession from "@/libs/requireSession";
import { getService } from "@/libs/services";

export default async function EditServicePage({ params }: { params: Promise<{ sid: string }> }) {
  const { sid } = await params;
  await requireSession(`/admin/services/${sid}/edit`, "admin");

  let service: ServiceItem;
  try {
    service = (await getService(sid)).data;
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-8">
      <PageHeader kicker="Admin" title="Edit service package">
        <span className="font-mono text-xs">ID: {service._id}</span>
      </PageHeader>
      <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
        <ServiceForm service={service} />
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50/50 p-5">
        <p className="text-sm text-red-800">Delete this package. It will no longer be bookable.</p>
        <ServiceDeleteButton id={service._id} redirectTo="/admin/services" />
      </div>
    </main>
  );
}
