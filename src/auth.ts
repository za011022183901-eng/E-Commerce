import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { SuccessLoginResponse } from "./interfaces";

function isSuccessLoginResponse(payload: unknown): payload is SuccessLoginResponse {
  if (!payload || typeof payload !== "object") return false;
  const candidate = payload as Record<string, unknown>;
  return typeof candidate.token === "string"
    && candidate.token.length > 0
    && !!candidate.user
    && typeof candidate.user === "object";
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

        if (!isSuccessLoginResponse(payload)) {
          const errorMessage = payload && typeof payload === "object" && "message" in payload
            ? payload.message
            : "unexpected response format";
          console.error("[auth] Sign-in service returned no usable account:", response.status, errorMessage);
          return null;
        }

        const userEmail = typeof payload.user.email === "string" ? payload.user.email.trim() || email : email;
        return {
          id: userEmail,
          name: payload.user.name || userEmail.split("@")[0],
          email: userEmail,
          user: { ...payload.user, email: userEmail },
          token: payload.token,
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
