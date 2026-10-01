import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedPages = ["/card", "/Wishlist", "/profile", "/allorders"];
const authPages = ["/login", "/register"];

export async function proxy(req: NextRequest) {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  // Auth.js chooses its cookie name from NEXTAUTH_URL. A browser/proxy can
  // still reach this process with a different protocol, so check both names.
  const configuredSecureCookie = process.env.NEXTAUTH_URL?.startsWith("https://")
    ?? req.nextUrl.protocol === "https:";
  const token = (await getToken({ req, secret, secureCookie: configuredSecureCookie }))
    ?? (await getToken({ req, secret, secureCookie: !configuredSecureCookie }));

  const isProtectedPage = protectedPages.some(
    (path) => req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(`${path}/`)
  );

  if (isProtectedPage) {
    if (token) {
      return NextResponse.next();
    }

    const redirectUrl = new URL("/login", req.nextUrl.origin);
    redirectUrl.searchParams.set("callBackUrl", req.nextUrl.pathname);

    return NextResponse.redirect(redirectUrl);
  }

  if (authPages.includes(req.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.next();
    }

    const redirectUrl = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}
