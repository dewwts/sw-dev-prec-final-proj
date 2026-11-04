"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dayjs, { type Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { createAppointment, updateAppointment } from "@/libs/appointments";
import { formatDuration, formatFee, toUtcSchedule } from "@/libs/format";
import { checkBookingRules } from "@/libs/rules";
import Alert from "./Alert";

type Props = {
  services: ServiceItem[];
  existing: AppointmentItem[];
  defaultServiceId?: string;
  appointment?: AppointmentItem; // present when editing
};

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

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!session) {
      setError("Your session has expired. Please sign in again.");
      return;
    }
    if (!serviceId || !registrationNumber.trim() || !brand.trim() || !model.trim() || !date || !time) {
      setError("Please fill in every field.");
      return;
    }
    if (!date.isValid() || !time.isValid()) {
      setError("Please pick a valid date and time.");
      return;
    }
    if (date.startOf("day").isBefore(dayjs().startOf("day"))) {
      setError("The appointment date cannot be before today.");
      return;
    }
    if (selected && selected.isActive === false) {
      setError("This service package is no longer offered. Please choose another one.");
      return;
    }

    const schedule = toUtcSchedule(date, time);
    // keep the saved duration when the package does not change (same as the backend)
    const durationMinutes =
      appointment && appointment.service?._id === serviceId ? appointment.durationMinutes : selected?.estimatedDuration ?? 1;
    const ruleError = checkBookingRules(
      {
        ownerId: appointment?.user?._id ?? session.user._id,
        registrationNumber,
        durationMinutes,
        ...schedule,
      },
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
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={submit} className="flex flex-col gap-8" noValidate>
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-signal">1 · Service package</legend>
          <FormControl fullWidth>
            <InputLabel id="service-label">Service package</InputLabel>
            <Select labelId="service-label" id="service" name="service" label="Service package" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
              {serviceOptions.map((s) => (
                <MenuItem key={s._id} value={s._id} disabled={s.isActive === false}>
                  {s.name} · {formatDuration(s.estimatedDuration)} · {formatFee(s.serviceFee)}
                  {s.isActive === false ? " (no longer offered)" : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selected ? <p className="text-sm text-steel">{selected.description}</p> : null}
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-signal">2 · Your car</legend>
          <TextField
            label="Registration number"
            name="registrationNumber"
            fullWidth
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="e.g. 1กข-1234"
            slotProps={{ htmlInput: { className: "plate" } }}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Brand" name="brand" fullWidth value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Toyota" />
            <TextField label="Model" name="model" fullWidth value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Yaris" />
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-signal">3 · Date &amp; time</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <DatePicker label="Date" value={date} onChange={setDate} disablePast format="DD/MM/YYYY" slotProps={{ textField: { fullWidth: true, name: "date" } }} />
            <TimePicker label="Start time" value={time} onChange={setTime} ampm={false} minutesStep={15} slotProps={{ textField: { fullWidth: true, name: "time" } }} />
          </div>
          {selected && date && time ? (
            <p className="font-mono text-sm text-steel">
              {date.format("ddd D MMM YYYY")} · {time.format("HH:mm")} –{" "}
              {time
                .add(appointment && appointment.service?._id === serviceId ? appointment.durationMinutes : selected.estimatedDuration, "minute")
                .format("HH:mm")}
            </p>
          ) : null}
        </fieldset>

        {error ? <Alert>{error}</Alert> : null}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={loading} className="rounded-md bg-signal px-6 py-3 font-semibold text-white transition hover:bg-signal-dark disabled:opacity-60">
            {loading ? "Saving…" : editing ? "Save changes" : "Book appointment"}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-md border border-ink/20 px-6 py-3 font-semibold text-ink hover:bg-ink/5">
            Cancel
          </button>
        </div>
      </form>
    </LocalizationProvider>
  );
}
