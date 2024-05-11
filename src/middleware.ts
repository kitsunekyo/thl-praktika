import { get } from "@vercel/edge-config";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// paths that should only be accessible to unauthenticated users
const UNAUTHENTICATED_MATCHER = new RegExp(
  "/((login|signup|auth-error|forgot-password|reset-password).*)",
);

const MAINTENANCE_MATCHER = new RegExp("/maintenance");

export default withAuth(
  async function middleware(req) {
    const isInMaintenance =
      process.env.NODE_ENV !== "development" && (await get("isInMaintenance"));
    if (isInMaintenance && !MAINTENANCE_MATCHER.test(req.url)) {
      return NextResponse.redirect(new URL("/maintenance", req.url));
    }

    if (MAINTENANCE_MATCHER.test(req.url)) {
      if (!isInMaintenance) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    const path = req.nextUrl.pathname;

    if (UNAUTHENTICATED_MATCHER.test(path)) {
      if (!!req.nextauth.token) {
        return NextResponse.redirect(new URL("/", req.url));
      } else {
        return NextResponse.next();
      }
    }

    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|pwa|img|robots.txt|apple-icon.ico|apple-icon.png|opengraph-image.jpg|twitter-image.jpg|manifest.json|sw.js|workbox-.*|about|legal|changelog).*)",
};
