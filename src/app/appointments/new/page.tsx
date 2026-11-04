import Link from "next/link";
import Alert from "@/components/Alert";
import AppointmentForm from "@/components/AppointmentForm";
import PageHeader from "@/components/PageHeader";
import { getAppointments } from "@/libs/appointments";
import { isFuture, MAX_FUTURE_APPOINTMENTS } from "@/libs/format";
import requireSession from "@/libs/requireSession";
import { getServices } from "@/libs/services";
import { link } from "@/libs/ui";

export default async function NewAppointmentPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const session = await requireSession(`/appointments/new${service ? `?service=${service}` : ""}`, "member");
  const [services, appointments] = await Promise.all([getServices(), getAppointments(session.user.token)]);
  const futureCount = appointments.data.filter(isFuture).length;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <PageHeader title="จองคิวเข้ารับบริการ">
        เวลาที่แสดงเป็นเวลาท้องถิ่นของคุณ · นัดล่วงหน้า {futureCount}/{MAX_FUTURE_APPOINTMENTS}
      </PageHeader>
      {futureCount >= MAX_FUTURE_APPOINTMENTS ? (
        <div className="flex flex-col gap-4">
          <Alert kind="info">คุณมีนัดล่วงหน้าครบ {MAX_FUTURE_APPOINTMENTS} นัดแล้ว ซึ่งเป็นจำนวนสูงสุด</Alert>
          <Link href="/appointments" className={link}>ไปที่นัดหมายของฉัน</Link>
        </div>
      ) : services.count === 0 ? (
        <Alert kind="info">ยังไม่มีแพ็กเกจบริการให้จอง</Alert>
      ) : (
        <AppointmentForm services={services.data} existing={appointments.data} defaultServiceId={service} />
      )}
    </main>
  );
}
