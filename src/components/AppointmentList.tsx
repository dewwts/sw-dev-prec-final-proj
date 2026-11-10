"use client";

import { useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { dayKey, isFuture } from "@/libs/format";
import { normalizePlate } from "@/libs/rules";
import AppointmentCard from "./AppointmentCard";

type Status = "all" | "upcoming" | "past";
const STATUS: [Status, string][] = [
  ["all", "ทั้งหมด"],
  ["upcoming", "กำลังจะถึง"],
  ["past", "ผ่านมาแล้ว"],
];

function matches(a: AppointmentItem, query: string, isAdmin: boolean) {
  if (!query) return true;
  const q = query.toLowerCase();
  const plateQuery = normalizePlate(query);
  if (plateQuery && a.registrationNumber.includes(plateQuery)) return true;
  const fields = [a.brand, a.model, `${a.brand} ${a.model}`, a.service?.name ?? ""];
  if (isAdmin && a.user) fields.push(a.user.name, a.user.email, a.user.tel);
  return fields.some((f) => f.toLowerCase().includes(q));
}

// Appointment list with search and filters (runs in the browser, nothing extra is fetched)
export default function AppointmentList({ appointments, isAdmin }: { appointments: AppointmentItem[]; isAdmin: boolean }) {
  const [query, setQuery] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [status, setStatus] = useState<Status>("all");

  // packages that appear in the list, so the menu never offers an empty result
  const serviceOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const a of appointments) if (a.service) seen.set(a.service._id, a.service.name);
    return [...seen.entries()].sort((x, y) => x[1].localeCompare(y[1], "th"));
  }, [appointments]);

  const dateKey = date?.isValid() ? date.format("YYYY-MM-DD") : "";
  const filtered = appointments.filter(
    (a) =>
      matches(a, query.trim(), isAdmin) &&
      (!serviceId || a.service?._id === serviceId) &&
      (!dateKey || dayKey(a.startsAt) === dateKey)
  );
  const upcoming = filtered.filter(isFuture);
  const past = filtered.filter((a) => !isFuture(a)).reverse();
  const active = Boolean(query || serviceId || dateKey || status !== "all");
  const shownCount = status === "upcoming" ? upcoming.length : status === "past" ? past.length : filtered.length;

  const clear = () => {
    setQuery("");
    setServiceId("");
    setDate(null);
    setStatus("all");
  };

  if (appointments.length === 0) {
    return <p className="rounded-2xl border border-dashed border-neutral-200 p-12 text-center text-neutral-400">ยังไม่มีนัดหมาย</p>;
  }

  return (
    <>
      <div role="search" aria-label="ค้นหานัดหมาย" className="mb-8 flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr]">
          <TextField
            size="small"
            label="ค้นหา"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isAdmin ? "ทะเบียน, รถ, แพ็กเกจ, ชื่อหรืออีเมลผู้จอง" : "ทะเบียน, รถ หรือแพ็กเกจ"}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                    </svg>
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormControl size="small">
            <InputLabel id="filter-service-label">แพ็กเกจ</InputLabel>
            <Select labelId="filter-service-label" label="แพ็กเกจ" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
              <MenuItem value="">ทุกแพ็กเกจ</MenuItem>
              {serviceOptions.map(([id, name]) => (
                <MenuItem key={id} value={id}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <DatePicker
            label="วันที่นัด"
            value={date}
            onChange={setDate}
            format="DD/MM/YYYY"
            slotProps={{ textField: { size: "small" }, field: { clearable: true } }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-neutral-200 p-0.5" role="group" aria-label="สถานะ">
            {STATUS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={status === value}
                onClick={() => setStatus(value)}
                className={`rounded-md px-3 py-1.5 text-sm transition ${status === value ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-sm text-neutral-400" aria-live="polite">
            {active ? `พบ ${shownCount} จาก ${appointments.length} รายการ` : `ทั้งหมด ${appointments.length} รายการ`}
          </span>
          {active ? (
            <button type="button" onClick={clear} className="text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900">
              ล้างตัวกรอง
            </button>
          ) : null}
        </div>
      </div>

      {status !== "past" ? (
        <Section title="กำลังจะถึง" items={upcoming} isAdmin={isAdmin} empty={active ? "ไม่พบนัดที่ตรงกับตัวกรอง" : "ยังไม่มีนัดหมาย"} />
      ) : null}
      {status !== "upcoming" && (status === "past" || past.length > 0) ? (
        <div className={status === "past" ? "" : "mt-14"}>
          <Section title="ผ่านมาแล้ว" items={past} isAdmin={isAdmin} empty="ไม่พบนัดที่ตรงกับตัวกรอง" />
        </div>
      ) : null}
    </>
  );
}

function Section({ title, items, isAdmin, empty }: { title: string; items: AppointmentItem[]; isAdmin: boolean; empty: string }) {
  return (
    <section aria-label={title}>
      <h2 className="mb-4 text-sm text-neutral-400">{title} · {items.length}</h2>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-200 p-12 text-center text-neutral-400">{empty}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((a) => (
            <AppointmentCard key={a._id} appointment={a} showOwner={isAdmin} />
          ))}
        </div>
      )}
    </section>
  );
}
