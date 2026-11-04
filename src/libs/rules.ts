import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { MAX_FUTURE_APPOINTMENTS } from "./format";

dayjs.extend(utc);

// Same normalisation the backend uses to identify a car
export function normalizePlate(plate: string) {
  return plate.normalize("NFKC").replace(/[\s-]+/g, "").toUpperCase();
}

type Draft = {
  ownerId: string;
  registrationNumber: string;
  appointmentDate: string; // UTC YYYY-MM-DD
  startTime: string; // UTC HH:mm
  durationMinutes: number;
};

/**
 * Checks the booking conditions against appointments already known to the browser.
 * The backend re-checks everything; this just gives quicker, clearer feedback.
 * Returns an error message, or null when the draft looks fine.
 */
export function checkBookingRules(draft: Draft, existing: AppointmentItem[], excludeId?: string): string | null {
  const todayUtc = dayjs.utc().format("YYYY-MM-DD");
  if (draft.appointmentDate < todayUtc) return "วันนัดต้องไม่เป็นวันที่ผ่านมาแล้ว";

  const plate = normalizePlate(draft.registrationNumber);
  const startsAt = dayjs.utc(`${draft.appointmentDate}T${draft.startTime}:00Z`).valueOf();
  const endsAt = startsAt + draft.durationMinutes * 60_000;
  const others = existing.filter((a) => a._id !== excludeId);

  const sameDay = others.find(
    (a) => a.user?._id === draft.ownerId && a.registrationNumber === plate && a.appointmentDate.slice(0, 10) === draft.appointmentDate
  );
  if (sameDay) return `รถทะเบียน ${plate} มีนัดในวันนี้แล้ว (จองได้ 1 ครั้งต่อรถ 1 คันต่อวัน)`;

  const overlap = others.find(
    (a) => a.registrationNumber === plate && dayjs(a.startsAt).valueOf() < endsAt && dayjs(a.endsAt).valueOf() > startsAt
  );
  if (overlap) return `รถทะเบียน ${plate} มีนัดในช่วงเวลาที่ทับซ้อนกันอยู่แล้ว`;

  if (startsAt >= Date.now()) {
    const future = others.filter((a) => a.user?._id === draft.ownerId && dayjs(a.startsAt).valueOf() >= Date.now()).length;
    if (future >= MAX_FUTURE_APPOINTMENTS) return `มีนัดล่วงหน้าได้สูงสุด ${MAX_FUTURE_APPOINTMENTS} นัด`;
  }
  return null;
}
