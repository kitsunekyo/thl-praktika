import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// paths that should only be accessible to unauthenticated users
const UNAUTHENTICATED_MATCHER = new RegExp(
  "/((login|signup|auth-error|forgot-password|reset-password).*)",
);

export default withAuth(
  function middleware(req) {
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
    "/((?!api|_next/static|_next/image|favicon.ico|pwa|img|robots.txt|apple-icon.ico|opengraph-image.jpg|twitter-image.jpg|manifest.json|sw.js|workbox-.*|about|legal|changelog).*)",
};
