import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { SuccessLoginResponse, UserResponse } from "./interfaces";

process.env.NEXTAUTH_URL ??= "https://e-commerce-xi-ruby-59.vercel.app";

function parseLoginSuccess(payload: unknown, fallbackEmail: string): SuccessLoginResponse | null {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as Record<string, unknown>;
  const candidates: Record<string, unknown>[] = [root];
  if (root.data && typeof root.data === "object") {
    const data = root.data as Record<string, unknown>;
    candidates.push(data);
    if (data.data && typeof data.data === "object") candidates.push(data.data as Record<string, unknown>);
  }

  for (const candidate of candidates) {
    if (typeof candidate.token !== "string" || !candidate.token) continue;

    const rawUser = candidate.user && typeof candidate.user === "object"
      ? candidate.user as Partial<UserResponse>
      : {};
    const email = typeof rawUser.email === "string" && rawUser.email.trim()
      ? rawUser.email.trim()
      : fallbackEmail;
    const user: UserResponse = {
      name: typeof rawUser.name === "string" && rawUser.name ? rawUser.name : email.split("@")[0],
      email,
      role: typeof rawUser.role === "string" && rawUser.role ? rawUser.role : "user",
    };

    return {
      message: typeof candidate.message === "string" ? candidate.message : "success",
      token: candidate.token,
      user,
    };
  }

  return null;
}





export const authOption: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({

      name: "JoJo",

      credentials: {
        email: {label: "Username", type: "text", placeholder: "enter you email" },
        password: {label: "Password", type: "password" , placeholder: "enter your password" },
      },

      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        let response: Response;
        try {
          response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
            body: JSON.stringify({ email, password }),
          });
        } catch (error) {
          console.error("[auth] Sign-in service request failed:", error);
          return null;
        }

        let payload: unknown;
        try {
          payload = await response.json();
        } catch (error) {
          console.error("[auth] Sign-in service returned invalid JSON:", response.status, error);
          return null;
        }

        const loginData = parseLoginSuccess(payload, email);
        if (!loginData) {
          const errorMessage = payload && typeof payload === "object" && "message" in payload
            ? payload.message
            : "unexpected response format";
          console.error("[auth] Sign-in service returned no usable account:", response.status, errorMessage);
          return null;
        }

        return {
          id: loginData.user.email,
          name: loginData.user.name,
          email: loginData.user.email,
          user: loginData.user,
          token: loginData.token,
        };
      }

    })
  ],




callbacks: {
  jwt: ({ token, user }) => {
    if (user) {
      const authenticatedUser = user as typeof user & {
        user?: SuccessLoginResponse["user"];
        token?: string;
      };
      token.user = authenticatedUser.user ?? {
        name: authenticatedUser.name ?? "",
        email: authenticatedUser.email ?? "",
        role: "user",
      };
      if (authenticatedUser.token) token.token = authenticatedUser.token;
    }
    return token;
  },

  session: ({ session, token }) => {
    const authenticatedUser = token.user as SuccessLoginResponse["user"] | undefined;
    if (authenticatedUser) session.user = authenticatedUser as typeof session.user;
    return session;
  },
},

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 يوم بالثواني
  },
  
  

pages:{
   signIn: "/login",
   error:'/login'
}



};

export const { handlers, auth, signIn, signOut } = NextAuth(authOption);
