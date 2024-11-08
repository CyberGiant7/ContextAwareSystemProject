import NextAuth from 'next-auth';
import {authConfig} from './auth.config';
export { auth as middleware } from "@/auth"

export default NextAuth(authConfig).auth;

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    // matcher: ['/profile', '/sign-in', '/sign-up']
    matcher: ['/profile', '/survey']
};