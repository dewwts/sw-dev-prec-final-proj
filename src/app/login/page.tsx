import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Alert from "@/components/Alert";
import ClearSession from "@/components/ClearSession";
import LoginForm from "@/components/LoginForm";
import PageHeader from "@/components/PageHeader";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; expired?: string }> }) {
  const { callbackUrl, expired } = await searchParams;
  // only allow relative callback urls
  const target = callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/appointments";
  const session = await getServerSession(authOptions);
  if (session && !expired) redirect(target);

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16">
      {expired && session ? <ClearSession /> : null}
      <PageHeader kicker="Welcome back" title="Sign in">Sign in with your email and password.</PageHeader>
      {expired ? (
        <div className="mb-6">
          <Alert kind="info">Your session has expired. Please sign in again.</Alert>
        </div>
      ) : null}
      <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
        <LoginForm callbackUrl={target} />
      </div>
    </main>
  );
}
