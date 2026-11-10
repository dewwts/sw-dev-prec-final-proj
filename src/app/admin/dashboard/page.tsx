import Link from "next/link";
import DayBarChart from "@/components/DayBarChart";
import PageHeader from "@/components/PageHeader";
import { getAppointments } from "@/libs/appointments";
import { formatFee, formatTime, inAppTz } from "@/libs/format";
import requireSession from "@/libs/requireSession";
import { getServices } from "@/libs/services";
import { dashboardStats } from "@/libs/stats";
import { card, link } from "@/libs/ui";

export default async function AdminDashboardPage() {
  const session = await requireSession("/admin/dashboard", "admin");
  const [appointments, services] = await Promise.all([getAppointments(session.user.token), getServices()]);
  const stats = dashboardStats(appointments.data, services.data);
  const topCount = stats.popular[0]?.count ?? 1;

  const tiles = [
    ["นัดวันนี้", String(stats.todayCount), "นัด"],
    ["นัดที่กำลังจะถึง", String(stats.upcomingCount), "นัด"],
    ["รายได้ที่คาดว่าจะได้รับ", formatFee(stats.expectedRevenue), "จากนัดที่กำลังจะถึง"],
    ["ลูกค้าที่มีนัด", String(stats.memberCount), "คน"],
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <PageHeader kicker="ผู้ดูแลระบบ" title="แดชบอร์ด">
        ภาพรวมนัดหมายและแพ็กเกจบริการ · ข้อมูล ณ {inAppTz().format("D MMM YYYY HH:mm")} น. (เวลาไทย)
      </PageHeader>

      <section aria-label="ตัวเลขสรุป" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map(([label, value, unit]) => (
          <div key={label} className={`${card} p-5`}>
            <p className="text-sm text-neutral-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-neutral-900">{value}</p>
            <p className="mt-1 text-xs text-neutral-400">{unit}</p>
          </div>
        ))}
      </section>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <section aria-labelledby="chart-title" className={`${card} p-6 pl-10`}>
          <h2 id="chart-title" className="font-semibold text-neutral-900">นัดหมาย 7 วันข้างหน้า</h2>
          <p className="mb-8 mt-1 text-sm text-neutral-400">จำนวนนัดต่อวัน · ชี้ที่แท่งเพื่อดูตัวเลข</p>
          <DayBarChart days={stats.next7Days} />
        </section>

        <section aria-labelledby="popular-title" className={`${card} p-6`}>
          <h2 id="popular-title" className="font-semibold text-neutral-900">แพ็กเกจยอดนิยม</h2>
          <p className="mb-6 mt-1 text-sm text-neutral-400">นับจากนัดหมายทั้งหมด</p>
          {stats.popular.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-400">ยังไม่มีการจอง</p>
          ) : (
            <ol className="flex flex-col gap-4">
              {stats.popular.slice(0, 5).map((s, i) => (
                <li key={s.id} title={`${s.name}: ${s.count} นัด · ${formatFee(s.revenue)}`}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate text-neutral-900">
                      <span className="mr-2 tabular-nums text-neutral-300">{i + 1}</span>
                      {s.name}
                    </span>
                    <span className="shrink-0 tabular-nums text-neutral-500">
                      <span className="font-medium text-neutral-900">{s.count}</span> นัด · {formatFee(s.revenue)}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-neutral-100">
                    <div className="h-full rounded-full bg-neutral-900" style={{ width: `${(s.count / topCount) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section aria-labelledby="next-title" className={`${card} mt-3 p-6`}>
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 id="next-title" className="font-semibold text-neutral-900">นัดหมายถัดไป</h2>
          <Link href="/appointments" className={`${link} text-sm`}>ดูทั้งหมด</Link>
        </div>
        {stats.nextAppointments.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-400">ไม่มีนัดที่กำลังจะถึง</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {stats.nextAppointments.map((a) => (
              <li key={a._id} className="flex flex-wrap items-center gap-x-6 gap-y-1 py-3 text-sm">
                <span className="w-36 shrink-0 tabular-nums text-neutral-900">
                  {inAppTz(a.startsAt).format("D MMM")} · {formatTime(a.startsAt)} น.
                </span>
                <span className="min-w-0 flex-1 truncate text-neutral-900">{a.service?.name ?? "แพ็กเกจถูกลบแล้ว"}</span>
                <span className="plate rounded-md border border-neutral-200 px-2 py-0.5 font-medium text-neutral-900">{a.registrationNumber}</span>
                <span className="w-40 truncate text-neutral-500">{a.user?.name}</span>
                <Link href={`/appointments/${a._id}/edit`} className="text-neutral-400 transition hover:text-neutral-900">แก้ไข</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
