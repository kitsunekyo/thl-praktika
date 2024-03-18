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

const APP_TITLE = "THL Praktika";
const APP_DEFAULT_TITLE = "THL Praktika";
const APP_TITLE_TEMPLATE = "%s | THL Praktika";
const APP_DESCRIPTION =
  "Vereinfachte Pratika Planung für Trainer:innen und Stundent:innen.";

export const metadata: Metadata = {
  applicationName: APP_TITLE,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_TITLE,
    locale: "de_AT",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
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
