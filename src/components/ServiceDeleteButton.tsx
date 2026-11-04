"use client";

import { useSession } from "next-auth/react";
import { deleteService } from "@/libs/services";
import DeleteButton from "./DeleteButton";

export default function ServiceDeleteButton({ id, redirectTo }: { id: string; redirectTo?: string }) {
  const { data: session } = useSession();
  return (
    <DeleteButton
      label="ลบ"
      redirectTo={redirectTo}
      onDelete={() => {
        if (!session) return Promise.reject(new Error("กรุณาเข้าสู่ระบบอีกครั้ง"));
        return deleteService(session.user.token, id);
      }}
    />
  );
}
