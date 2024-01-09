import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const publicPaths = [
  "/legal",
  "/about",
  "/img",
  "/opengraph-image.jpg",
  "/favicon.ico",
  "/apple-icon.ico",
  "/twitter-image.jpg",
  "/robots.txt",
  "/api/uploadthing",
];

const authPaths = [
  "/login",
  "/signup",
  "/auth-error",
  "/forgot-password",
  "/reset-password",
];

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    if (publicPaths.some((p) => path.startsWith(p))) {
      return NextResponse.next();
    }

    if (authPaths.some((p) => path.startsWith(p))) {
      if (!!req.nextauth.token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = req.nextauth.token.role;

    const firstPathSegment: string | undefined = path
      .split("/")
      .filter((p) => p !== "")?.[0];

    if (firstPathSegment === "admin" && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (firstPathSegment === "trainer" && role === "user") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);
