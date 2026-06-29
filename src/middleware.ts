import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedPages = ['/card', '/Wishlist', '/profile', '/allorders' , '/profile/accountUser'];
const authPages = ['/login', '/register'];

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  // حماية الصفحات المحمية
  if (protectedPages.includes(req.nextUrl.pathname)) {
    if (token) {
      return NextResponse.next(); // السماح بالوصول

    } else {
      let redirectUrl = new URL('/login' , process.env.NEXTAUTH_URL);
      
      redirectUrl.searchParams.set('callBackUrl' , req.nextUrl.pathname )

      return NextResponse.redirect(redirectUrl);
    }
  }

  // منع الدخول لصفحات تسجيل الدخول والتسجيل إذا المستخدم مسجل دخول
  if (authPages.includes(req.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.next(); // السماح بالدخول
    } else {
      const redirectUrl = new URL('/', process.env.NEXTAUTH_URL);
      return NextResponse.redirect(redirectUrl); // إعادة توجيه للصفحة الرئيسية
    }
  }

  // إذا لم يكن في أي شرط، السماح بالوصول
  return NextResponse.next();
}
