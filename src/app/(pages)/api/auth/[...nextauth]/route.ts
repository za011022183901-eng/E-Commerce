import { authOption } from '@/auth';
import { FailedLoginResponse, SuccessLoginResponse } from './../../../../../interfaces/login';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth(authOption)

export { handler as GET, handler as POST };
