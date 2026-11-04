"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { InputAdornment, TextField } from "@mui/material";
import { createService, updateService } from "@/libs/services";
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
      setError("Your session has expired. Please sign in again.");
      return;
    }
    const estimatedDuration = Number(duration);
    const serviceFee = Number(fee);
    if (!name.trim() || !description.trim() || duration === "" || fee === "") {
      setError("Please fill in every field.");
      return;
    }
    if (!Number.isInteger(estimatedDuration) || estimatedDuration < 1) {
      setError("Estimated duration must be a whole number of minutes (at least 1).");
      return;
    }
    if (!Number.isFinite(serviceFee) || serviceFee < 0) {
      setError("Service fee cannot be negative.");
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
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <TextField label="Service name" name="name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Description" name="description" fullWidth multiline minRows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Estimated duration"
          name="estimatedDuration"
          type="number"
          fullWidth
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          slotProps={{ input: { endAdornment: <InputAdornment position="end">min</InputAdornment> }, htmlInput: { min: 1, step: 1 } }}
        />
        <TextField
          label="Service fee"
          name="serviceFee"
          type="number"
          fullWidth
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start">฿</InputAdornment> }, htmlInput: { min: 0, step: "any" } }}
        />
      </div>
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={loading} className="rounded-md bg-signal px-6 py-3 font-semibold text-white transition hover:bg-signal-dark disabled:opacity-60">
          {loading ? "Saving…" : service ? "Save changes" : "Add package"}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-md border border-ink/20 px-6 py-3 font-semibold text-ink hover:bg-ink/5">
          Cancel
        </button>
      </div>
    </form>
  );
}
