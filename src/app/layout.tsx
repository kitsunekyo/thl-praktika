/* eslint-disable import/no-duplicates */
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { setDefaultOptions } from "date-fns";
import { deAT } from "date-fns/locale";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { extractRouterConfig } from "uploadthing/server";

import { inter } from "@/assets/fonts/inter";
import { Loading } from "@/components/Loading";
import PostHogPageView from "@/components/PostHogPageView";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

import { ourFileRouter } from "./api/uploadthing/core";

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
    startupImage: [
      "/pwa/ios/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png",
      {
        media:
          "screen and (device-width: 430px) and (device-height: 932px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)",
        url: "/pwa/ios/splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png",
      },
      {
        media:
          "screen and (device-width: 393px) and (device-height: 852px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)",
        url: "/pwa/ios/splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png",
      },
      {
        media:
          "screen and (device-width: 428px) and (device-height: 926px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)",
        url: "/pwa/ios/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png",
      },
      {
        media:
          "screen and (device-width: 390px) and (device-height: 844px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)",
        url: "/pwa/ios/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png",
      },
      {
        media:
          "screen and (device-width: 375px) and (device-height: 812px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)",
        url: "/pwa/ios/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 896px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)",
        url: "/pwa/ios/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 896px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)",
        url: "/pwa/ios/splash_screens/iPhone_11__iPhone_XR_portrait.png",
      },
      {
        media:
          "screen and (device-width: 414px) and (device-height: 736px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)",
        url: "/pwa/ios/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png",
      },
      {
        media:
          "screen and (device-width: 375px) and (device-height: 667px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)",
        url: "/pwa/ios/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png",
      },
      {
        media:
          "screen and (device-width: 1032px) and (device-height: 1376px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)",
        url: "/pwa/ios/splash_screens/13__iPad_Pro_M4_portrait.png",
      },
      {
        media:
          "screen and (device-width: 1024px) and (device-height: 1366px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)",
        url: "/pwa/ios/splash_screens/12.9__iPad_Pro_portrait.png",
      },
      {
        media:
          "screen and (device-width: 834px) and (device-height: 1210px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)",
        url: "/pwa/ios/splash_screens/11__iPad_Pro_M4_portrait.png",
      },
      {
        media:
          "screen and (device-width: 834px) and (device-height: 1194px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)",
        url: "/pwa/ios/splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png",
      },
      {
        media:
          "screen and (device-width: 820px) and (device-height: 1180px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)",
        url: "/pwa/ios/splash_screens/10.9__iPad_Air_portrait.png",
      },
      {
        media:
          "screen and (device-width: 834px) and (device-height: 1112px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)",
        url: "/pwa/ios/splash_screens/10.5__iPad_Air_portrait.png",
      },
      {
        media:
          "screen and (device-width: 810px) and (device-height: 1080px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)",
        url: "/pwa/ios/splash_screens/10.2__iPad_portrait.png",
      },
      {
        media:
          "screen and (device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)",
        url: "/pwa/ios/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png",
      },
      {
        media:
          "screen and (device-width: 744px) and (device-height: 1133px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)",
        url: "/pwa/ios/splash_screens/8.3__iPad_Mini_portrait.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "de_AT",
  },
  twitter: {
    card: "summary",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "width",
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
