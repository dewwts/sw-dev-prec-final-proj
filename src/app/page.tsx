import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Alert from "@/components/Alert";
import { btnPrimary, btnSecondary } from "@/libs/ui";

const rules = [
  ["วันนัดต้องไม่ย้อนหลัง", "เลือกได้ตั้งแต่วันนี้เป็นต้นไป"],
  ["1 ครั้งต่อรถ 1 คันต่อวัน", "รถแต่ละคันจองได้วันละ 1 ครั้ง"],
  ["เวลาไม่ทับซ้อน", "รถคันเดียวกันมีนัดในช่วงเวลาเดียวกันไม่ได้"],
  ["1 แพ็กเกจต่อนัด", "แต่ละนัดเลือกบริการได้ 1 รายการ"],
  ["นัดล่วงหน้าสูงสุด 3 นัด", "มีนัดที่ยังไม่ถึงกำหนดได้ไม่เกิน 3 นัด"],
];

export default async function Home({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const { denied } = await searchParams;
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6">
      <section className="grid items-center gap-8 py-16 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        <div>
          {denied ? (
            <div className="mb-8 max-w-md">
              <Alert kind="info">หน้านี้ไม่เปิดให้บัญชีประเภทของคุณใช้งาน</Alert>
            </div>
          ) : null}
          <p className="text-sm text-neutral-400">ระบบจองคิวนำรถเข้ารับบริการ</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-6xl sm:leading-[1.1] lg:text-5xl xl:text-6xl">
            <span className="lg:whitespace-nowrap">นัดวันเข้าศูนย์บริการ</span>
            <br />
            <span className="text-neutral-400">ง่าย ไม่ต้องรอคิว</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-neutral-500">
            เลือกแพ็กเกจบริการ กรอกข้อมูลรถ แล้วเลือกวันและเวลาที่สะดวก
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/services" className={btnPrimary}>ดูบริการทั้งหมด</Link>
            {role === "member" ? <Link href="/appointments/new" className={btnSecondary}>จองคิว</Link> : null}
            {role === "admin" ? <Link href="/admin/services" className={btnSecondary}>จัดการบริการ</Link> : null}
            {!session ? <Link href="/register" className={btnSecondary}>สมัครสมาชิก</Link> : null}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          {/* soft ground shadow so the white car sits on the white page */}
          <div
            className="absolute inset-x-[4%] bottom-[16%] h-[14%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.12),transparent)] blur-md"
            aria-hidden
          />
          <Image
            src="/img/hero-car.png"
            alt="รถสปอร์ตสีขาว"
            width={1280}
            height={960}
            priority
            sizes="(min-width: 1024px) 560px, 90vw"
            className="relative h-auto w-full drop-shadow-[0_24px_24px_rgba(0,0,0,0.08)]"
          />
        </div>
      </section>

      <section className="border-t border-neutral-100 py-16">
        <h2 className="text-lg font-semibold text-neutral-900">เงื่อนไขการจอง</h2>
        <ol className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
          {rules.map(([title, text], i) => (
            <li key={title}>
              <span className="text-sm tabular-nums text-neutral-300">0{i + 1}</span>
              <h3 className="mt-2 font-medium text-neutral-900">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
