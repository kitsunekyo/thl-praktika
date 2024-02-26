/* eslint-disable import/no-duplicates */
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { setDefaultOptions } from "date-fns";
import { deAT } from "date-fns/locale";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { extractRouterConfig } from "uploadthing/server";

import { Loading } from "@/components/Loading";
import PostHogPageView from "@/components/PostHogPageView";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

import { ourFileRouter } from "./api/uploadthing/core";

const inter = Inter({ subsets: ["latin"] });

setDefaultOptions({
  locale: deAT,
});

export const metadata: Metadata = {
  title: "THL Praktika",
  description:
    "Vereinfachte Pratika Planung für Trainer:innen und Stundent:innen.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  applicationName: "THL Praktika",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "THL Praktika",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "de_AT",
  },
  twitter: {
    card: "summary",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Providers>
            <PostHogPageView />
            {children}
            <Toaster />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
