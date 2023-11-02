/* eslint-disable import/no-duplicates */
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { setDefaultOptions } from "date-fns";
import { deAT } from "date-fns/locale";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { extractRouterConfig } from "uploadthing/server";

import { Toaster } from "@/components/ui/toaster";

import { ourFileRouter } from "./api/uploadthing/core";
import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

setDefaultOptions({
  locale: deAT,
});

export const metadata: Metadata = {
  title: "THL Praktika",
  description:
    "Vereinfachte Pratika Planung für Trainer:innen und Stundent:innen.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
