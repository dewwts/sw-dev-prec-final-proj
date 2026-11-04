import type { Metadata } from "next";
import { Archivo, Archivo_Black, JetBrains_Mono } from "next/font/google";
import { getServerSession } from "next-auth";
import TopMenu from "@/components/TopMenu";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import "./globals.css";

const body = Archivo({ subsets: ["latin"], variable: "--font-body" });
const display = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-display-face" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-face" });

export const metadata: Metadata = {
  title: "PitStop — Car Service Booking",
  description: "Book a time to bring your car to the service center.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${mono.variable}`}>
      <body>
        <NextAuthProvider session={session}>
          <TopMenu />
          {children}
          <footer className="mt-24 border-t border-ink/10 py-8 text-center text-xs text-steel">
            PitStop Service Center · Project 4 · Tinnapat Sittisuwan
          </footer>
        </NextAuthProvider>
      </body>
    </html>
  );
}
