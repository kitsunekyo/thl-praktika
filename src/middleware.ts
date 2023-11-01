import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const publicPaths = ["/legal", "/about", "/img"];

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
    if (publicPaths.some((p) => path.startsWith(p))) {
      return NextResponse.next();
    }

    if (publicOnlyPaths.some((p) => path.startsWith(p))) {
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
    if (firstPathSegment === "trainer" && role !== "trainer") {
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
