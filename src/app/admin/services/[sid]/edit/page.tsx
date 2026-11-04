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
    <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <PageHeader kicker="ผู้ดูแลระบบ" title="แก้ไขแพ็กเกจบริการ">
        <span className="text-xs text-neutral-400">รหัส {service._id}</span>
      </PageHeader>
      <ServiceForm service={service} />
      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 p-5">
        <p className="text-sm text-neutral-500">ลบแพ็กเกจนี้ (จะไม่สามารถจองได้อีก)</p>
        <ServiceDeleteButton id={service._id} redirectTo="/admin/services" />
      </div>
    </main>
  );
}
