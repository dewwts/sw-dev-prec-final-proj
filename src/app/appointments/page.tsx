import Link from "next/link";
import Alert from "@/components/Alert";
import AppointmentCard from "@/components/AppointmentCard";
import PageHeader from "@/components/PageHeader";
import { getAppointments } from "@/libs/appointments";
import { isFuture, MAX_FUTURE_APPOINTMENTS } from "@/libs/format";
import requireSession from "@/libs/requireSession";
import { btnPrimary } from "@/libs/ui";

export default async function AppointmentsPage({ searchParams }: { searchParams: Promise<{ created?: string; updated?: string }> }) {
  const session = await requireSession("/appointments");
  const { created, updated } = await searchParams;
  const isAdmin = session.user.role === "admin";
  const appointments = (await getAppointments(session.user.token)).data;

  const upcoming = appointments.filter(isFuture);
  const past = appointments.filter((a) => !isFuture(a)).reverse();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader kicker={isAdmin ? "ผู้ดูแลระบบ" : undefined} title={isAdmin ? "นัดหมายทั้งหมด" : "นัดหมายของฉัน"}>
          {isAdmin
            ? `นัดหมายของสมาชิกทุกคน ${appointments.length} รายการ แก้ไขหรือลบได้ทุกรายการ`
            : `นัดล่วงหน้า ${upcoming.length} จาก ${MAX_FUTURE_APPOINTMENTS} นัด`}
        </PageHeader>
        {!isAdmin && upcoming.length < MAX_FUTURE_APPOINTMENTS ? (
          <Link href="/appointments/new" className={`${btnPrimary} mb-10`}>+ จองคิวใหม่</Link>
        ) : null}
      </div>

      <div className="mb-8 flex flex-col gap-3 empty:hidden">
        {created ? <Alert kind="success">จองคิวเรียบร้อยแล้ว</Alert> : null}
        {updated ? <Alert kind="success">บันทึกการแก้ไขเรียบร้อยแล้ว</Alert> : null}
        {!isAdmin && upcoming.length >= MAX_FUTURE_APPOINTMENTS ? (
          <Alert kind="info">คุณมีนัดล่วงหน้าครบ {MAX_FUTURE_APPOINTMENTS} นัดแล้ว ต้องลบนัดเดิมก่อนจึงจะจองเพิ่มได้</Alert>
        ) : null}
      </div>

      <section aria-labelledby="upcoming-title">
        <h2 id="upcoming-title" className="mb-4 text-sm text-neutral-400">กำลังจะถึง · {upcoming.length}</h2>
        {upcoming.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-200 p-12 text-center text-neutral-400">ยังไม่มีนัดหมาย</p>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map((a) => (
              <AppointmentCard key={a._id} appointment={a} showOwner={isAdmin} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 ? (
        <section aria-labelledby="past-title" className="mt-14">
          <h2 id="past-title" className="mb-4 text-sm text-neutral-400">ผ่านมาแล้ว · {past.length}</h2>
          <div className="flex flex-col gap-3">
            {past.map((a) => (
              <AppointmentCard key={a._id} appointment={a} showOwner={isAdmin} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
