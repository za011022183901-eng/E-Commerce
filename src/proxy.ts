import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedPages = ["/card", "/Wishlist", "/profile", "/allorders", "/profile/accountUser"];
const authPages = ["/login", "/register"];

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });

  if (protectedPages.includes(req.nextUrl.pathname)) {
    if (token) {
      return NextResponse.next();
    }

    const redirectUrl = new URL("/login", process.env.NEXTAUTH_URL);
    redirectUrl.searchParams.set("callBackUrl", req.nextUrl.pathname);

    return NextResponse.redirect(redirectUrl);
  }

  if (authPages.includes(req.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.next();
    }

    const redirectUrl = new URL("/", process.env.NEXTAUTH_URL);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}
