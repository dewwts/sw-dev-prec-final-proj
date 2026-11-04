import Link from "next/link";
import { btnPrimary } from "@/libs/ui";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-24 text-center">
      <p className="text-sm text-neutral-400">404</p>
      <h1 className="mt-1 text-2xl font-semibold text-neutral-900">ไม่พบหน้านี้</h1>
      <p className="mt-3 text-neutral-500">หน้า แพ็กเกจ หรือนัดหมายนี้ไม่มีอยู่ หรือคุณไม่มีสิทธิ์เข้าถึง</p>
      <Link href="/" className={`${btnPrimary} mt-8`}>กลับหน้าแรก</Link>
    </main>
  );
}
