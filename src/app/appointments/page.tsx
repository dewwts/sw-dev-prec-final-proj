import Link from "next/link";
import Alert from "@/components/Alert";
import AppointmentCard from "@/components/AppointmentCard";
import PageHeader from "@/components/PageHeader";
import { getAppointments } from "@/libs/appointments";
import { isFuture, MAX_FUTURE_APPOINTMENTS } from "@/libs/format";
import requireSession from "@/libs/requireSession";

export default async function AppointmentsPage({ searchParams }: { searchParams: Promise<{ created?: string; updated?: string }> }) {
  const session = await requireSession("/appointments");
  const { created, updated } = await searchParams;
  const isAdmin = session.user.role === "admin";
  const appointments = (await getAppointments(session.user.token)).data;

  const upcoming = appointments.filter(isFuture);
  const past = appointments.filter((a) => !isFuture(a)).reverse();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-8">
      <PageHeader kicker={isAdmin ? "Admin" : "Member"} title={isAdmin ? "All appointments" : "My appointments"}>
        {isAdmin
          ? `Every member's appointments (${appointments.length} total). You can edit or delete any of them.`
          : `You have ${upcoming.length} of ${MAX_FUTURE_APPOINTMENTS} upcoming appointments.`}
      </PageHeader>

      <div className="mb-8 space-y-3">
        {created ? <Alert kind="success">Appointment booked.</Alert> : null}
        {updated ? <Alert kind="success">Appointment updated.</Alert> : null}
        {!isAdmin && upcoming.length >= MAX_FUTURE_APPOINTMENTS ? (
          <Alert kind="info">You have reached the limit of {MAX_FUTURE_APPOINTMENTS} upcoming appointments. Delete one to book another.</Alert>
        ) : null}
      </div>

      {!isAdmin && upcoming.length < MAX_FUTURE_APPOINTMENTS ? (
        <Link href="/appointments/new" className="mb-10 inline-block rounded-md bg-signal px-5 py-2.5 text-sm font-semibold text-white hover:bg-signal-dark">
          + Book an appointment
        </Link>
      ) : null}

      <section aria-labelledby="upcoming-title">
        <h2 id="upcoming-title" className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-steel">
          Upcoming · {upcoming.length}
        </h2>
        {upcoming.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink/20 p-10 text-center text-steel">No upcoming appointments.</p>
        ) : (
          <div className="space-y-4">
            {upcoming.map((a) => (
              <AppointmentCard key={a._id} appointment={a} showOwner={isAdmin} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 ? (
        <section aria-labelledby="past-title" className="mt-12">
          <h2 id="past-title" className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-steel">
            Past · {past.length}
          </h2>
          <div className="space-y-4">
            {past.map((a) => (
              <AppointmentCard key={a._id} appointment={a} showOwner={isAdmin} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
