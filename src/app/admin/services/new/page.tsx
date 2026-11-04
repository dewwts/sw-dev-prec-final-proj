import PageHeader from "@/components/PageHeader";
import ServiceForm from "@/components/ServiceForm";
import requireSession from "@/libs/requireSession";

export default async function NewServicePage() {
  await requireSession("/admin/services/new", "admin");

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <PageHeader kicker="ผู้ดูแลระบบ" title="เพิ่มแพ็กเกจบริการ" />
      <ServiceForm />
    </main>
  );
}
