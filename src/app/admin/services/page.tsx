import Link from "next/link";
import Alert from "@/components/Alert";
import PageHeader from "@/components/PageHeader";
import ServiceDeleteButton from "@/components/ServiceDeleteButton";
import { formatDuration, formatFee } from "@/libs/format";
import requireSession from "@/libs/requireSession";
import { getServices } from "@/libs/services";
import { btnPrimary, btnSecondary } from "@/libs/ui";

export default async function AdminServicesPage({ searchParams }: { searchParams: Promise<{ created?: string; updated?: string }> }) {
  await requireSession("/admin/services", "admin");
  const { created, updated } = await searchParams;
  const services = await getServices();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader kicker="ผู้ดูแลระบบ" title="จัดการบริการ">
          เพิ่ม แก้ไข หรือลบแพ็กเกจบริการ แพ็กเกจที่ลบแล้วจะจองไม่ได้ แต่นัดหมายเดิมยังอยู่
        </PageHeader>
        <Link href="/admin/services/new" className={`${btnPrimary} mb-10`}>+ เพิ่มแพ็กเกจ</Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 empty:hidden">
        {created ? <Alert kind="success">เพิ่มแพ็กเกจเรียบร้อยแล้ว</Alert> : null}
        {updated ? <Alert kind="success">บันทึกการแก้ไขเรียบร้อยแล้ว</Alert> : null}
      </div>

      {services.count === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-200 p-12 text-center text-neutral-400">ยังไม่มีแพ็กเกจบริการ</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-200 text-neutral-400">
              <tr>
                <th className="px-5 py-3 font-normal">แพ็กเกจ</th>
                <th className="px-5 py-3 font-normal">รหัส</th>
                <th className="px-5 py-3 font-normal">ระยะเวลา</th>
                <th className="px-5 py-3 font-normal">ค่าบริการ</th>
                <th className="px-5 py-3 font-normal" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {services.data.map((s) => (
                <tr key={s._id} className="align-middle">
                  <td className="px-5 py-4">
                    <Link href={`/services/${s._id}`} className="font-medium text-neutral-900 hover:underline">{s.name}</Link>
                    <p className="mt-0.5 line-clamp-1 max-w-xs text-neutral-500">{s.description}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-neutral-400">{s._id}</td>
                  <td className="px-5 py-4 text-neutral-700">{formatDuration(s.estimatedDuration)}</td>
                  <td className="px-5 py-4 tabular-nums text-neutral-900">{formatFee(s.serviceFee)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/services/${s._id}/edit`} className={`${btnSecondary} px-4 py-2`}>แก้ไข</Link>
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
