import dayjs from "dayjs";
import { formatDate, formatDuration, formatFee, formatTime, isFuture } from "@/libs/format";
import AppointmentActions from "./AppointmentActions";

export default function AppointmentCard({ appointment, showOwner }: { appointment: AppointmentItem; showOwner: boolean }) {
  const upcoming = isFuture(appointment);
  // editing needs a date today or later (backend rule), past history can still be deleted
  const canEdit = !dayjs(appointment.startsAt).isBefore(dayjs().startOf("day"));
  const start = dayjs(appointment.startsAt);

  return (
    <article className={`flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm sm:flex-row ${upcoming ? "border-ink/10" : "border-ink/5 opacity-75"}`}>
      <div className={`flex shrink-0 flex-row items-center justify-between gap-4 px-6 py-4 sm:w-40 sm:flex-col sm:justify-center sm:py-6 ${upcoming ? "bg-ink text-white" : "bg-ink/10 text-ink"}`}>
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest opacity-70">{start.format("MMM")}</p>
          <p className="font-display text-4xl leading-none">{start.format("D")}</p>
          <p className="font-mono text-xs opacity-70">{start.format("YYYY")}</p>
        </div>
        <p className="font-mono text-sm font-semibold text-signal">
          {formatTime(appointment.startsAt)}–{formatTime(appointment.endsAt)}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg uppercase leading-tight text-ink">
              {appointment.service?.name ?? "Service package removed"}
            </h3>
            <p className="mt-1 text-sm text-steel">
              {formatDate(appointment.startsAt)} · {formatDuration(appointment.durationMinutes)}
              {appointment.service ? ` · ${formatFee(appointment.service.serviceFee)}` : ""}
              {appointment.service && appointment.service.isActive === false ? " · package no longer offered" : ""}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${upcoming ? "bg-signal/10 text-signal" : "bg-ink/5 text-steel"}`}>
            {upcoming ? "Upcoming" : "Past"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="plate rounded border-2 border-ink bg-paper px-3 py-1 text-sm font-bold text-ink">{appointment.registrationNumber}</span>
          <span className="text-sm text-ink">
            {appointment.brand} {appointment.model}
          </span>
        </div>
        {showOwner && appointment.user ? (
          <p className="text-sm text-steel">
            <span className="font-semibold text-ink">Member:</span> {appointment.user.name} · {appointment.user.email} · {appointment.user.tel}
          </p>
        ) : null}
        <AppointmentActions id={appointment._id} canEdit={canEdit} />
      </div>
    </article>
  );
}
