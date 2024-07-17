import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import AuthOptions  from 'next-auth';
import {NextRequest} from "next/server";

export default NextAuth(authConfig).auth;


export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/secret']
};