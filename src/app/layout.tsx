import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";

import { authOptions, getSession } from "./api/auth/[...nextauth]/route";
import { AuthHeader } from "./AuthHeader";
import { Header } from "./Header";
import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "THL Prakta",
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
            <Header>
              <AuthHeader session={session} />
            </Header>
          </div>
          <main>
            <div className="container my-8 md:my-20">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
