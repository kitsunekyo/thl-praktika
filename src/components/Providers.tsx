"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

import { PostHogProvider } from "./PostHogProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PostHogProvider>{children}</PostHogProvider>
    </SessionProvider>
  );
}
