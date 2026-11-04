import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";
import PageHeader from "@/components/PageHeader";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16">
      <PageHeader kicker="New customer" title="Register">Create an account to book service appointments.</PageHeader>
      <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
        <RegisterForm />
      </div>
    </main>
  );
}
