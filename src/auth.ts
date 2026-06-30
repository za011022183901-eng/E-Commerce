import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { FailedLoginResponse, SuccessLoginResponse } from "./interfaces";




export const authOption : AuthOptions= {
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
  jwt: ({ token, user }) => {   // كلام ثابت
    if (user) {
      token.user = user.user
      token.token = user.token
    }
    return token
  },

  session: ({ session, token }) => {  // كلام ثابت
    session.user = token.user
    return session
  }
},



  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 يوم بالثواني
  },
  
  

pages:{
   signIn: "/login",
   error:'/login'
}



};
