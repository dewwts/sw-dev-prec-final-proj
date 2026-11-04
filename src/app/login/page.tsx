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
    <main className="mx-auto w-full max-w-sm px-4 py-20">
      {expired && session ? <ClearSession /> : null}
      <PageHeader title="เข้าสู่ระบบ">ใช้อีเมลและรหัสผ่านที่สมัครไว้</PageHeader>
      {expired ? (
        <div className="mb-6">
          <Alert kind="info">เซสชันหมดอายุแล้ว กรุณาเข้าสู่ระบบอีกครั้ง</Alert>
        </div>
      ) : null}
      <LoginForm callbackUrl={target} />
    </main>
  );
}
