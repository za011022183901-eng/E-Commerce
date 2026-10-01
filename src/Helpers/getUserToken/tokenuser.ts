import { decode, getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

const sessionCookieNames = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
];

export async function getUserToken(request?: Request): Promise<string> {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) return "";

  // API routes provide the actual request, so Auth.js can parse and reassemble
  // its own cookie chunks using the correct HTTP/HTTPS cookie name.
  if (request) {
    const isSecure = new URL(request.url).protocol === "https:";
    const preferredName = `${isSecure ? "__Secure-" : ""}authjs.session-token`;
    const candidates = [preferredName, ...sessionCookieNames.filter((name) => name !== preferredName)];

    for (const cookieName of candidates) {
      const session = await getToken({
        req: request,
        secret,
        cookieName,
        secureCookie: cookieName.startsWith("__Secure-"),
      });
      if (typeof session?.token === "string") return session.token;
    }
  }

  // Server Actions do not receive a Request object, so read the cookie store
  // and combine chunked Auth.js cookies before decrypting them.
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  for (const cookieName of sessionCookieNames) {
    const directCookie = cookieStore.get(cookieName)?.value;
    const chunks = allCookies
      .filter(({ name }) => name.startsWith(`${cookieName}.`))
      .sort((a, b) => Number(a.name.slice(cookieName.length + 1)) - Number(b.name.slice(cookieName.length + 1)));
    const sessionToken = directCookie || (chunks.length ? chunks.map(({ value }) => value).join("") : "");
    if (!sessionToken) continue;

    try {
      const session = await decode({ token: sessionToken, secret, salt: cookieName });
      if (typeof session?.token === "string") return session.token;
    } catch (error) {
      console.error("Unable to read the authenticated session token:", error);
    }
  }

  return "";
}
