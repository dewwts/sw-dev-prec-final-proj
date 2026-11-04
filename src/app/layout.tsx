import type { Metadata } from "next";
import { Anuphan } from "next/font/google";
import { getServerSession } from "next-auth";
import TopMenu from "@/components/TopMenu";
import NextAuthProvider from "@/providers/NextAuthProvider";
import MuiProvider from "@/providers/MuiProvider";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import "./globals.css";

const anuphan = Anuphan({ subsets: ["thai", "latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-anuphan" });

export const metadata: Metadata = {
  title: "PitStop — จองคิวเข้ารับบริการรถยนต์",
  description: "จองวันและเวลานำรถเข้ารับบริการที่ศูนย์บริการ",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="th" className={anuphan.variable}>
      <body>
        <NextAuthProvider session={session}>
          <MuiProvider>
            <TopMenu />
            {children}
            <footer className="mt-24 border-t border-neutral-100 py-10 text-center text-xs text-neutral-400">
              PitStop ศูนย์บริการรถยนต์ · Project 4 · Tinnapat Sittisuwan
            </footer>
          </MuiProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
