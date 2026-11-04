"use client";

import { btnPrimary } from "@/libs/ui";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-neutral-900">โหลดหน้านี้ไม่สำเร็จ</h1>
      <p className="mt-3 text-neutral-500">{error.message || "เกิดข้อผิดพลาดที่ไม่คาดคิด"}</p>
      <p className="mt-1 text-sm text-neutral-400">ตรวจสอบว่า backend ทำงานอยู่ (ค่า BACKEND_URL ใน .env.local)</p>
      <button type="button" onClick={reset} className={`${btnPrimary} mt-8`}>ลองอีกครั้ง</button>
    </main>
  );
}
