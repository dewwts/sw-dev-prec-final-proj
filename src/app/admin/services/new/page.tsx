import PageHeader from "@/components/PageHeader";
import ServiceForm from "@/components/ServiceForm";
import requireSession from "@/libs/requireSession";

export default async function NewServicePage() {
  await requireSession("/admin/services/new", "admin");

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-8">
      <PageHeader kicker="Admin" title="New service package" />
      <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
        <ServiceForm />
      </div>
    </main>
  );
}
