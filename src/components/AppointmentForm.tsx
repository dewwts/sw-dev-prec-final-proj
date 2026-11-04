"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dayjs, { type Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { createAppointment, updateAppointment } from "@/libs/appointments";
import { formatDuration, formatFee, formatShortDate, toUtcSchedule } from "@/libs/format";
import { checkBookingRules } from "@/libs/rules";
import { btnPrimary, btnSecondary } from "@/libs/ui";
import Alert from "./Alert";

type Props = {
  services: ServiceItem[];
  existing: AppointmentItem[];
  defaultServiceId?: string;
  appointment?: AppointmentItem; // present when editing
};

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-4 flex items-center gap-3 text-sm font-medium text-neutral-900">
        <span className="grid h-6 w-6 place-items-center rounded-full border border-neutral-200 text-xs text-neutral-500">{step}</span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export default function AppointmentForm({ services, existing, defaultServiceId, appointment }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const editing = Boolean(appointment);

  // an appointment may point at a package that has since been removed; keep it visible in the list
  const serviceOptions = useMemo(() => {
    if (appointment?.service && !services.some((s) => s._id === appointment.service?._id)) {
      return [appointment.service, ...services];
    }
    return services;
  }, [services, appointment]);

  const [serviceId, setServiceId] = useState(
    appointment?.service?._id ?? (services.some((s) => s._id === defaultServiceId) ? defaultServiceId! : "")
  );
  const [registrationNumber, setRegistrationNumber] = useState(appointment?.registrationNumber ?? "");
  const [brand, setBrand] = useState(appointment?.brand ?? "");
  const [model, setModel] = useState(appointment?.model ?? "");
  const [date, setDate] = useState<Dayjs | null>(appointment ? dayjs(appointment.startsAt) : null);
  const [time, setTime] = useState<Dayjs | null>(appointment ? dayjs(appointment.startsAt) : null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = serviceOptions.find((s) => s._id === serviceId);
  // keep the saved duration when the package does not change (same as the backend)
  const durationMinutes =
    appointment && appointment.service?._id === serviceId ? appointment.durationMinutes : selected?.estimatedDuration ?? 1;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!session) {
      setError("เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง");
      return;
    }
    if (!serviceId || !registrationNumber.trim() || !brand.trim() || !model.trim() || !date || !time) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    if (!date.isValid() || !time.isValid()) {
      setError("กรุณาเลือกวันและเวลาให้ถูกต้อง");
      return;
    }
    if (date.startOf("day").isBefore(dayjs().startOf("day"))) {
      setError("วันนัดต้องไม่เป็นวันที่ผ่านมาแล้ว");
      return;
    }
    if (selected && selected.isActive === false) {
      setError("แพ็กเกจนี้ยกเลิกแล้ว กรุณาเลือกแพ็กเกจอื่น");
      return;
    }

    const schedule = toUtcSchedule(date, time);
    const ruleError = checkBookingRules(
      { ownerId: appointment?.user?._id ?? session.user._id, registrationNumber, durationMinutes, ...schedule },
      existing,
      appointment?._id
    );
    if (ruleError) {
      setError(ruleError);
      return;
    }

    const input: AppointmentInput = {
      service: serviceId,
      registrationNumber: registrationNumber.trim(),
      brand: brand.trim(),
      model: model.trim(),
      ...schedule,
    };

    setLoading(true);
    try {
      if (appointment) {
        await updateAppointment(session.user.token, appointment._id, input);
      } else {
        await createAppointment(session.user.token, input);
      }
      router.push(`/appointments?${editing ? "updated" : "created"}=1`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-10" noValidate>
      <Section step={1} title="แพ็กเกจบริการ">
        <FormControl fullWidth>
          <InputLabel id="service-label">เลือกแพ็กเกจ</InputLabel>
          <Select labelId="service-label" id="service" name="service" label="เลือกแพ็กเกจ" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            {serviceOptions.map((s) => (
              <MenuItem key={s._id} value={s._id} disabled={s.isActive === false}>
                {s.name} · {formatDuration(s.estimatedDuration)} · {formatFee(s.serviceFee)}
                {s.isActive === false ? " (ยกเลิกแล้ว)" : ""}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selected ? <p className="text-sm leading-6 text-neutral-500">{selected.description}</p> : null}
      </Section>

      <Section step={2} title="ข้อมูลรถ">
        <TextField
          label="ทะเบียนรถ"
          name="registrationNumber"
          fullWidth
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          placeholder="เช่น 1กข-1234"
          slotProps={{ htmlInput: { className: "plate" } }}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="ยี่ห้อ" name="brand" fullWidth value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="เช่น Toyota" />
          <TextField label="รุ่น" name="model" fullWidth value={model} onChange={(e) => setModel(e.target.value)} placeholder="เช่น Yaris" />
        </div>
      </Section>

      <Section step={3} title="วันและเวลา">
        <div className="grid gap-4 sm:grid-cols-2">
          <DatePicker label="วันที่" value={date} onChange={setDate} disablePast format="DD/MM/YYYY" slotProps={{ textField: { fullWidth: true, name: "date" } }} />
          <TimePicker label="เวลาเริ่ม" value={time} onChange={setTime} ampm={false} minutesStep={15} slotProps={{ textField: { fullWidth: true, name: "time" } }} />
        </div>
        {selected && date?.isValid() && time?.isValid() ? (
          <p className="text-sm text-neutral-500">
            {formatShortDate(date)} · {time.format("HH:mm")}–{time.add(durationMinutes, "minute").format("HH:mm")} น.
          </p>
        ) : null}
      </Section>

      {error ? <Alert>{error}</Alert> : null}

      <div className="flex flex-wrap gap-3 border-t border-neutral-100 pt-8">
        <button type="submit" disabled={loading} className={btnPrimary}>
          {loading ? "กำลังบันทึก…" : editing ? "บันทึกการแก้ไข" : "ยืนยันการจอง"}
        </button>
        <button type="button" onClick={() => router.back()} className={btnSecondary}>ยกเลิก</button>
      </div>
    </form>
  );
}
