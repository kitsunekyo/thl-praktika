/* eslint-disable import/no-duplicates */
import "./globals.css";
import { setDefaultOptions } from "date-fns";
import { deAT } from "date-fns/locale";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";

import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

setDefaultOptions({
  locale: deAT,
});

export const metadata: Metadata = {
  title: "THL Praktika",
  description: "THL Praktikums Planung",
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
        <Providers>
          {children}
          <Toaster />
          {/* <DateFnsLocale /> */}
        </Providers>
      </body>
    </html>
  );
}
