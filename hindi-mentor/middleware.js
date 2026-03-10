import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPath = req.nextUrl.pathname === "/admin/login";

  if (isAdminPath && !isLoginPath && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isLoginPath && token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
