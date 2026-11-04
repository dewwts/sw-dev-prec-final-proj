import dayjs from "dayjs";
import { formatDuration, formatFee, formatTime, isFuture } from "@/libs/format";
import AppointmentActions from "./AppointmentActions";

export default function AppointmentCard({ appointment, showOwner }: { appointment: AppointmentItem; showOwner: boolean }) {
  const upcoming = isFuture(appointment);
  // editing needs a date today or later (backend rule), past history can still be deleted
  const canEdit = !dayjs(appointment.startsAt).isBefore(dayjs().startOf("day"));
  const start = dayjs(appointment.startsAt).locale("th");

  return (
    <article className={`flex flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-5 sm:flex-row sm:items-center sm:gap-6 ${upcoming ? "" : "opacity-60"}`}>
      <div className="flex shrink-0 items-baseline gap-3 sm:w-28 sm:flex-col sm:items-start sm:gap-0">
        <p className="text-3xl font-semibold leading-none tabular-nums text-neutral-900">{start.format("D")}</p>
        <p className="text-sm text-neutral-500 sm:mt-1">{start.format("MMM YYYY")}</p>
        <p className="text-sm tabular-nums text-neutral-900 sm:mt-2">
          {formatTime(appointment.startsAt)}–{formatTime(appointment.endsAt)} น.
        </p>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:border-l sm:border-neutral-100 sm:pl-6">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-neutral-900">{appointment.service?.name ?? "แพ็กเกจถูกลบแล้ว"}</h3>
          <span className={`rounded-full px-2.5 py-0.5 text-xs ${upcoming ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500"}`}>
            {upcoming ? "กำลังจะถึง" : "ผ่านมาแล้ว"}
          </span>
        </div>
        <p className="text-sm text-neutral-500">
          {start.format("ddddที่ D MMMM YYYY")} · {formatDuration(appointment.durationMinutes)}
          {appointment.service ? ` · ${formatFee(appointment.service.serviceFee)}` : ""}
          {appointment.service && appointment.service.isActive === false ? " · แพ็กเกจยกเลิกแล้ว" : ""}
        </p>
        <p className="text-sm text-neutral-900">
          <span className="plate rounded-md border border-neutral-200 px-2 py-0.5 font-medium">{appointment.registrationNumber}</span>
          <span className="ml-2">{appointment.brand} {appointment.model}</span>
        </p>
        {showOwner && appointment.user ? (
          <p className="text-sm text-neutral-500">
            ผู้จอง: <span className="text-neutral-900">{appointment.user.name}</span> · {appointment.user.email} · {appointment.user.tel}
          </p>
        ) : null}
      </div>

      <div className="shrink-0">
        <AppointmentActions id={appointment._id} canEdit={canEdit} />
      </div>
    </article>
  );
}
