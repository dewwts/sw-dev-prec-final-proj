import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Alert from "@/components/Alert";

const rules = [
  ["01", "No past dates", "Appointments must be today or later."],
  ["02", "One visit per car per day", "Each car can be booked once a day."],
  ["03", "No overlaps", "The same car can't have two appointments at the same time."],
  ["04", "One package each", "Every appointment uses exactly one service package."],
  ["05", "Up to 3 upcoming", "You can hold at most three future appointments."],
];

export default async function Home({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const { denied } = await searchParams;
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  return (
    <main>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full border-[40px] border-white/5" aria-hidden />
        <div className="pointer-events-none absolute -right-10 top-20 h-56 w-56 rounded-full border-[24px] border-signal/30" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-8 sm:py-28">
          {denied ? (
            <div className="mb-8 max-w-lg">
              <Alert kind="info">That page is not available for your role.</Alert>
            </div>
          ) : null}
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal">Car service appointment booking</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl uppercase leading-[0.95] sm:text-7xl">
            Book your bay.
            <br />
            <span className="text-signal">Skip the queue.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Choose a service package, tell us about your car, and pick the date and time that suits you.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/services" className="rounded-md bg-signal px-6 py-3 font-semibold transition hover:bg-signal-dark">
              Browse services
            </Link>
            {role === "member" ? (
              <Link href="/appointments/new" className="rounded-md border border-white/30 px-6 py-3 font-semibold transition hover:bg-white hover:text-ink">
                Book an appointment
              </Link>
            ) : null}
            {role === "admin" ? (
              <Link href="/admin/services" className="rounded-md border border-white/30 px-6 py-3 font-semibold transition hover:bg-white hover:text-ink">
                Manage services
              </Link>
            ) : null}
            {!session ? (
              <Link href="/register" className="rounded-md border border-white/30 px-6 py-3 font-semibold transition hover:bg-white hover:text-ink">
                Create an account
              </Link>
            ) : null}
          </div>
        </div>
        <div className="hazard h-2" aria-hidden />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Booking rules</p>
        <h2 className="mt-2 font-display text-3xl uppercase text-ink">How booking works</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {rules.map(([num, title, text]) => (
            <li key={num} className="rounded-xl border border-ink/10 bg-white p-5">
              <span className="font-mono text-sm font-bold text-signal">{num}</span>
              <h3 className="mt-2 font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-steel">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
