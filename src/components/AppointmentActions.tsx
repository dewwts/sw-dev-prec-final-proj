"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { deleteAppointment } from "@/libs/appointments";
import DeleteButton from "./DeleteButton";

export default function AppointmentActions({ id, canEdit }: { id: string; canEdit: boolean }) {
  const { data: session } = useSession();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canEdit ? (
        <Link href={`/appointments/${id}/edit`} className="rounded-md border border-ink px-4 py-2 text-sm font-semibold text-ink hover:bg-ink hover:text-white">
          Edit
        </Link>
      ) : null}
      <DeleteButton
        label="Delete"
        onDelete={() => {
          if (!session) return Promise.reject(new Error("Please sign in again."));
          return deleteAppointment(session.user.token, id);
        }}
      />
    </div>
  );
}
