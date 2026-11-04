import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import PageHeader from "@/components/PageHeader";
import ServiceCard from "@/components/ServiceCard";
import { getServices } from "@/libs/services";

export default async function ServicesPage() {
  const [session, services] = await Promise.all([getServerSession(authOptions), getServices()]);
  const role = session?.user?.role;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8">
      <PageHeader kicker={`${services.count} packages`} title="Service packages">
        Pick a package, then choose a date and time to bring your car in.
        {!session ? (
          <>
            {" "}
            <Link href="/login?callbackUrl=/services" className="font-semibold text-signal underline underline-offset-4">Sign in</Link> to book.
          </>
        ) : null}
      </PageHeader>
      {role === "admin" ? (
        <div className="mb-8">
          <Link href="/admin/services/new" className="inline-block rounded-md bg-signal px-5 py-2.5 text-sm font-semibold text-white hover:bg-signal-dark">
            + Add service package
          </Link>
        </div>
      ) : null}
      {services.count === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/20 p-10 text-center text-steel">No service packages yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.data.map((service) => (
            <ServiceCard key={service._id} service={service} role={role} />
          ))}
        </div>
      )}
    </main>
  );
}
