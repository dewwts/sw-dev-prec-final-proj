import { notFound } from "next/navigation";
import AppointmentForm from "@/components/AppointmentForm";
import PageHeader from "@/components/PageHeader";
import { getAppointment, getAppointments } from "@/libs/appointments";
import requireSession from "@/libs/requireSession";
import { getServices } from "@/libs/services";

export default async function EditAppointmentPage({ params }: { params: Promise<{ aid: string }> }) {
  const { aid } = await params;
  const session = await requireSession(`/appointments/${aid}/edit`);

  let appointment: AppointmentItem;
  try {
    appointment = (await getAppointment(session.user.token, aid)).data;
  } catch {
    notFound();
  }
  const [services, appointments] = await Promise.all([getServices(), getAppointments(session.user.token)]);
  const isAdmin = session.user.role === "admin";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-8">
      <PageHeader kicker="Edit appointment" title="Change booking">
        {isAdmin && appointment.user ? `Booked by ${appointment.user.name} (${appointment.user.email}). ` : ""}
        Times are in your local time zone.
      </PageHeader>
      <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
        <AppointmentForm services={services.data} existing={appointments.data} appointment={appointment} />
      </div>
    </main>
  );
}
