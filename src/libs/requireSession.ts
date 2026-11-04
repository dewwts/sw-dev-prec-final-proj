import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getUserProfile } from "./auth";

// Server-side guard for protected pages. Sends guests to /login and wrong roles home.
export default async function requireSession(callbackUrl: string, role?: "admin" | "member") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  // the backend token may have expired or the user may no longer exist
  let valid = true;
  try {
    await getUserProfile(session.user.token);
  } catch {
    valid = false;
  }
  if (!valid) {
    redirect(`/login?expired=1&callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  if (role && session.user.role !== role) {
    redirect("/?denied=1");
  }
  return session;
}
