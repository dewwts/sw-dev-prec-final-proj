import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";
import PageHeader from "@/components/PageHeader";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-20">
      <PageHeader title="สมัครสมาชิก">สร้างบัญชีเพื่อเริ่มจองคิวเข้ารับบริการ</PageHeader>
      <RegisterForm />
    </main>
  );
}
