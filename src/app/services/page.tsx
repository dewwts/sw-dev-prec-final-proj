import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
import { getServices } from "@/libs/services";
import { btnPrimary, link } from "@/libs/ui";

export default async function ServicesPage() {
  const [session, services] = await Promise.all([getServerSession(authOptions), getServices()]);
  const role = session?.user?.role;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader kicker={`${services.count} แพ็กเกจ`} title="บริการของเรา">
        เลือกแพ็กเกจที่ต้องการ แล้วเลือกวันและเวลาที่จะนำรถเข้ามา
        {!session ? (
          <>
            {" · "}
            <Link href="/login?callbackUrl=/services" className={link}>เข้าสู่ระบบ</Link>เพื่อจองคิว
          </>
        ) : null}
      </PageHeader>
      {role === "admin" ? (
        <div className="mb-8">
          <Link href="/admin/services/new" className={btnPrimary}>+ เพิ่มแพ็กเกจบริการ</Link>
        </div>
      ) : null}
      {services.count === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-200 p-12 text-center text-neutral-400">ยังไม่มีแพ็กเกจบริการ</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.data.map((service) => (
            <ServiceCard key={service._id} service={service} role={role} />
          ))}
        </div>
      )}
    </main>
  );
}
