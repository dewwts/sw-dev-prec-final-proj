"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { InputAdornment, TextField } from "@mui/material";
import { createService, updateService } from "@/libs/services";
import { btnPrimary, btnSecondary } from "@/libs/ui";
import Alert from "./Alert";

export default function ServiceForm({ service }: { service?: ServiceItem }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [duration, setDuration] = useState(service ? String(service.estimatedDuration) : "");
  const [fee, setFee] = useState(service ? String(service.serviceFee) : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!session) {
      setError("เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง");
      return;
    }
    const estimatedDuration = Number(duration);
    const serviceFee = Number(fee);
    if (!name.trim() || !description.trim() || duration === "" || fee === "") {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    if (!Number.isInteger(estimatedDuration) || estimatedDuration < 1) {
      setError("ระยะเวลาต้องเป็นจำนวนเต็มนาที (อย่างน้อย 1 นาที)");
      return;
    }
    if (!Number.isFinite(serviceFee) || serviceFee < 0) {
      setError("ค่าบริการต้องไม่ติดลบ");
      return;
    }

    const input: ServiceInput = { name: name.trim(), description: description.trim(), estimatedDuration, serviceFee };
    setLoading(true);
    try {
      if (service) {
        await updateService(session.user.token, service._id, input);
      } else {
        await createService(session.user.token, input);
      }
      router.push(`/admin/services?${service ? "updated" : "created"}=1`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <TextField label="ชื่อบริการ" name="name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="รายละเอียด" name="description" fullWidth multiline minRows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="ระยะเวลาโดยประมาณ"
          name="estimatedDuration"
          type="number"
          fullWidth
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          slotProps={{ input: { endAdornment: <InputAdornment position="end">นาที</InputAdornment> }, htmlInput: { min: 1, step: 1 } }}
        />
        <TextField
          label="ค่าบริการ"
          name="serviceFee"
          type="number"
          fullWidth
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          slotProps={{ input: { endAdornment: <InputAdornment position="end">บาท</InputAdornment> }, htmlInput: { min: 0, step: "any" } }}
        />
      </div>
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex flex-wrap gap-3 border-t border-neutral-100 pt-6">
        <button type="submit" disabled={loading} className={btnPrimary}>
          {loading ? "กำลังบันทึก…" : service ? "บันทึกการแก้ไข" : "เพิ่มแพ็กเกจ"}
        </button>
        <button type="button" onClick={() => router.back()} className={btnSecondary}>ยกเลิก</button>
      </div>
    </form>
  );
}
