
import { UserResponse } from "@/interfaces"
import NextAuth from "next-auth"
import NextAuth,{User} from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
     user:UserResponse // الحاجه اللي عاوزنها من تشفير

  }

  interface User {

    user: UserResponse, // الحاجه اللي بنعرفها 
    token : string
   
  }

}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */

  interface JWT extends User {} // عاوزين نشفر اي
  
  
}