import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { FailedLoginResponse, SuccessLoginResponse } from "./interfaces";





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

        const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        );

        const payload : SuccessLoginResponse | FailedLoginResponse  = await response.json();

           if("token" in payload){

               return {

            id:payload.user.email,
            user: payload.user ,
            token:  payload.token ,
             email: payload.user.email,                      
                      };
           }else{

            throw new Error (payload.message)
           }

      
      }

    })
  ],




callbacks: {
  jwt: ({ token, user }) => {
    if (user) {
      // next-auth v5 types are flexible here; we keep the same shape you use in the project
      token.user = (user as any).user;
      token.token = (user as any).token;
    }
    return token;
  },

  session: ({ session, token }) => {
    // Ensure session.user always exists to avoid runtime crashes
    (session as any).user = (token as any).user;
    return session;
  },
},

  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 يوم بالثواني
  },
  
  

pages:{
   signIn: "/login",
   error:'/login'
}



};

export const { handlers, auth, signIn, signOut } = NextAuth(authOption);
