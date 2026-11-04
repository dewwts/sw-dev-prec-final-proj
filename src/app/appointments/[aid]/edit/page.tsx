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
    <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <PageHeader title="แก้ไขนัดหมาย">
        {isAdmin && appointment.user ? `ผู้จอง: ${appointment.user.name} (${appointment.user.email}) · ` : ""}
        เวลาที่แสดงเป็นเวลาท้องถิ่นของคุณ
      </PageHeader>
      <AppointmentForm services={services.data} existing={appointments.data} appointment={appointment} />
    </main>
  );
}
