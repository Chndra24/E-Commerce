import { NextResponse, type NextRequest } from "next/server";

/**
 * Lapis pertama (UX): redirect cepat sebelum route dirender.
 *
 * Proxy hanya memeriksa keberadaan cookie sesi, bukan validitasnya, karena
 * memverifikasi JWT dan mengakses database di sini menambah ketergantungan
 * runtime yang tidak perlu. Otorisasi sesungguhnya tetap dilakukan di server
 * melalui requireAdmin() (src/lib/auth-guards.ts).
 */
const SESSION_COOKIE_NAMES = ["authjs.session-token", "__Secure-authjs.session-token"];

export function proxy(request: NextRequest) {
  const hasSessionCookie = SESSION_COOKIE_NAMES.some((name) => request.cookies.has(name));

  if (hasSessionCookie) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
