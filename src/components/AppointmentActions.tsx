"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { deleteAppointment } from "@/libs/appointments";
import { btnSecondary } from "@/libs/ui";
import DeleteButton from "./DeleteButton";

export default function AppointmentActions({ id, canEdit }: { id: string; canEdit: boolean }) {
  const { data: session } = useSession();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canEdit ? (
        <Link href={`/appointments/${id}/edit`} className={`${btnSecondary} px-4 py-2`}>แก้ไข</Link>
      ) : null}
      <DeleteButton
        onDelete={() => {
          if (!session) return Promise.reject(new Error("กรุณาเข้าสู่ระบบอีกครั้ง"));
          return deleteAppointment(session.user.token, id);
        }}
      />
    </div>
  );
}
