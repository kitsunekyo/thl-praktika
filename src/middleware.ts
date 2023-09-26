import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const publicOnlyPaths = [
  "/login",
  "/signup",
  "/auth-error",
  "/forgot-password",
  "/reset-password",
];

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;

    if (publicOnlyPaths.includes(path)) {
      if (!!req.nextauth.token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = req.nextauth.token.role;

    if (path.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (path.startsWith("/trainer") && role === "user") {
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
