import dayjs, { type Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/th";

dayjs.extend(utc);
dayjs.locale("th");

export const MAX_FUTURE_APPOINTMENTS = 3;

export function formatFee(fee: number) {
  return `฿${fee.toLocaleString("th-TH", { maximumFractionDigits: 2 })}`;
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} นาที`;
  return m === 0 ? `${h} ชม.` : `${h} ชม. ${m} นาที`;
}

// The backend reads date + time as UTC, so the picked local date/time is converted before sending
export function toUtcSchedule(date: Dayjs, time: Dayjs) {
  const local = date.hour(time.hour()).minute(time.minute()).second(0).millisecond(0);
  const asUtc = local.utc();
  return { appointmentDate: asUtc.format("YYYY-MM-DD"), startTime: asUtc.format("HH:mm") };
}

export function formatDate(iso: string) {
  return dayjs(iso).locale("th").format("ddddที่ D MMMM YYYY");
}

export function formatShortDate(value: Dayjs | string) {
  return dayjs(value).locale("th").format("D MMM YYYY");
}

export function formatTime(iso: string) {
  return dayjs(iso).format("HH:mm");
}

export function isFuture(appointment: AppointmentItem) {
  return dayjs(appointment.startsAt).valueOf() >= Date.now();
}
