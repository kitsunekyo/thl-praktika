import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent,
) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;
  const role = token?.role;

  if (
    isAuthenticated &&
    [
      "/login",
      "/signup",
      "/auth-error",
      "/forgot-password",
      "/reset-password",
    ].some((path) => req.nextUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/trainer") && role === "user") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const authMiddleware = withAuth({
    pages: {
      signIn: "/login",
      error: "/auth-error",
    },
  });

  // @ts-expect-error
  return authMiddleware(req, event);
}

export const config = { matcher: ["/", "/admin(.*)", "/trainer(.*)"] };
