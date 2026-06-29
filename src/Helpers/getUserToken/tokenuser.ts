import { decode } from "next-auth/jwt"
import { cookies } from "next/headers"

export async function getUserToken(){

const x=(await cookies()).get('next-auth.session-token')?.value  // بنجيب الاسم ونحطه

const accessToken = await decode({token:x , secret:process.env.AUTH_SECRET!});


return accessToken?.token



}







