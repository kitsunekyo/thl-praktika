"use client";

import { useSession } from "next-auth/react";
import { posthog } from "posthog-js";
import { PostHogProvider as PostHog_Provider } from "posthog-js/react";

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY &&
  process.env.NODE_ENV === "production"
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const session = useSession();
  if (session.data?.user) {
    posthog.identify(session.data.user.id, {
      email: session.data.user.email,
      name: session.data.user.name,
      role: session.data.user.role,
    });
  }
  return <PostHog_Provider client={posthog}>{children}</PostHog_Provider>;
}
