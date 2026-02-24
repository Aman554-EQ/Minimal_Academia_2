import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Mohammed Aman Bhuiyan | AI/ML Researcher",
  description: "Personal academic portfolio of Mohammed Aman Bhuiyan - AI/ML Enthusiast and CS Researcher at North South University",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
