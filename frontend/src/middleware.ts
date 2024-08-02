import NextAuth from 'next-auth';
import {authConfig} from './auth.config';
import AuthOptions from 'next-auth';
import {NextRequest, NextResponse} from "next/server";
import {getSession} from "next-auth/react";
import {auth} from "@/auth";

export default NextAuth(authConfig).auth;

// export async function middleware(request: any) {
//     const path = request.nextUrl.pathname
//     const session = await auth();
//
//     // Check if session exists or not
//     if (!session) {
//         // If not authenticated, check if the user is trying to access /login or /signup
//         if (path === '/sign-in' || path.includes('/sign-up')) {
//             // Allow access to /login and /signup for unauthenticated users
//             return NextResponse.next()
//         }
//         // Redirect to the login page for any other unauthenticated requests
//         return NextResponse.redirect(new URL("/sign-in", request.url))
//     }
//     // If session exists and trying to access /login or /signup, redirect to the home page
//     if (path === '/sign-in' || path.includes('/sign-up')) {
//         return NextResponse.redirect(new URL("/", request.url))
//     }
//     // Allow access to any other routes during the session
//     return NextResponse.next()
// }

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    // matcher: ['/secret', '/sign-in', '/sign-up']
    matcher: ['/secret']
};