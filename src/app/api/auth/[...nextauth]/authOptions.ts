import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userLogIn, userLogOut } from "@/libs/auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        try {
          // backend returns { success, data: { id, name, email, role, token } }
          const { data } = await userLogIn(credentials.email, credentials.password);
          return { id: data.id, _id: data.id, name: data.name, email: data.email, role: data.role, token: data.token };
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as unknown as typeof session.user;
      return session;
    },
  },
  events: {
    // tell the backend to clear its auth cookie as well
    async signOut({ token }) {
      const jwt = (token as { token?: string } | null)?.token;
      if (jwt) {
        try {
          await userLogOut(jwt);
        } catch {
          /* backend logout is best effort; the session is already gone */
        }
      }
    },
  },
};
