import { dayKey, inAppTz, isFuture } from "./format";

export type DayBucket = { key: string; label: string; fullLabel: string; count: number };
export type ServiceStat = { id: string; name: string; count: number; revenue: number };

// Numbers for the admin dashboard, worked out from the appointment and service lists
export function dashboardStats(appointments: AppointmentItem[], services: ServiceItem[]) {
  const today = inAppTz().startOf("day");
  const todayKey = today.format("YYYY-MM-DD");
  const upcoming = appointments.filter(isFuture).sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  const countByDay = new Map<string, number>();
  for (const a of appointments) {
    const key = dayKey(a.startsAt);
    countByDay.set(key, (countByDay.get(key) ?? 0) + 1);
  }

  const next7Days: DayBucket[] = Array.from({ length: 7 }, (_, i) => {
    const day = today.add(i, "day");
    const key = day.format("YYYY-MM-DD");
    return {
      key,
      label: i === 0 ? "วันนี้" : day.format("dd D"),
      fullLabel: day.format("ddddที่ D MMM"),
      count: countByDay.get(key) ?? 0,
    };
  });

  // every package that has been booked, including ones deleted since
  const byService = new Map<string, ServiceStat>();
  for (const s of services) byService.set(s._id, { id: s._id, name: s.name, count: 0, revenue: 0 });
  for (const a of appointments) {
    if (!a.service) continue;
    const stat = byService.get(a.service._id) ?? { id: a.service._id, name: a.service.name, count: 0, revenue: 0 };
    stat.count += 1;
    stat.revenue += a.service.serviceFee;
    byService.set(a.service._id, stat);
  }
  const popular = [...byService.values()].filter((s) => s.count > 0).sort((a, b) => b.count - a.count || b.revenue - a.revenue);

  return {
    todayCount: countByDay.get(todayKey) ?? 0,
    upcomingCount: upcoming.length,
    expectedRevenue: upcoming.reduce((sum, a) => sum + (a.service?.serviceFee ?? 0), 0),
    memberCount: new Set(upcoming.map((a) => a.user?._id).filter(Boolean)).size,
    next7Days,
    popular,
    nextAppointments: upcoming.slice(0, 5),
  };
}
