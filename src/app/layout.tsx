import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/next-auth";

import { Header } from "./Header";
import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "THL Praktika",
  description: "THL Praktikums Planung",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="container">
            <Header user={session?.user} />
          </div>
          <main>
            <div className="container my-8 md:my-20">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
