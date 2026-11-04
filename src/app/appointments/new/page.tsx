import Link from "next/link";
import Alert from "@/components/Alert";
import AppointmentForm from "@/components/AppointmentForm";
import PageHeader from "@/components/PageHeader";
import { getAppointments } from "@/libs/appointments";
import { isFuture, MAX_FUTURE_APPOINTMENTS } from "@/libs/format";
import requireSession from "@/libs/requireSession";
import { getServices } from "@/libs/services";

export default async function NewAppointmentPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const session = await requireSession(`/appointments/new${service ? `?service=${service}` : ""}`, "member");
  const [services, appointments] = await Promise.all([getServices(), getAppointments(session.user.token)]);
  const futureCount = appointments.data.filter(isFuture).length;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-8">
      <PageHeader kicker="New appointment" title="Book a service">
        Times are in your local time zone. Upcoming appointments: {futureCount}/{MAX_FUTURE_APPOINTMENTS}.
      </PageHeader>
      <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
        {futureCount >= MAX_FUTURE_APPOINTMENTS ? (
          <div className="space-y-4">
            <Alert kind="info">You already have {MAX_FUTURE_APPOINTMENTS} upcoming appointments, which is the maximum.</Alert>
            <Link href="/appointments" className="inline-block font-semibold text-signal underline underline-offset-4">Manage my appointments</Link>
          </div>
        ) : services.count === 0 ? (
          <Alert kind="info">There are no service packages to book yet.</Alert>
        ) : (
          <AppointmentForm services={services.data} existing={appointments.data} defaultServiceId={service} />
        )}
      </div>
    </main>
  );
}
