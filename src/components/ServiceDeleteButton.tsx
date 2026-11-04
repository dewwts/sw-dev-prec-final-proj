"use client";

import { useSession } from "next-auth/react";
import { deleteService } from "@/libs/services";
import DeleteButton from "./DeleteButton";

export default function ServiceDeleteButton({ id, redirectTo }: { id: string; redirectTo?: string }) {
  const { data: session } = useSession();
  return (
    <DeleteButton
      label="Delete"
      redirectTo={redirectTo}
      onDelete={() => {
        if (!session) return Promise.reject(new Error("Please sign in again."));
        return deleteService(session.user.token, id);
      }}
    />
  );
}
