import {NextAuthConfig} from "next-auth"
import {DefaultSession} from "@auth/core/types";
import {User} from "@/app/lib/definitions";


declare module "next-auth" {
    interface Session {
        user: {
            email: string;
            first_name: string;
            last_name: string;
        } & DefaultSession['user'];
    }
}

export const authConfig = {
    pages: {
        signIn: '/sign-in',
        signOut: '/',
        error: '/error', // Error code passed in query string as ?error=
        verifyRequest: '/verify-request', // (used for check email message)
        newUser: "/sas", // If set, new users will be directed here on first sign in
    },
    trustHost: true,
    callbacks: {
        async signIn({user, credentials}) {
            // console.log('signIn', {user, credentials});
            if (user) {
                console.log('signIn', {user, credentials});
                return true;
            }
            return false;
        },
        async redirect({url, baseUrl}) {
            // console.log('redirect', {url, baseUrl});
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        jwt({token, user}) {
            // console.log('jwt', {token, user});
            if (user) {
                delete (user as User)["password"];
                token.user = user;
            }
            return token;
        },

        session({session, token}) {
            // console.log('session return', {...session, user: token.user as User});
            return {
                ...session,
                user: token.user as User
            }
        },
        authorized({auth, request: {nextUrl}}) {
            // console.log('authorized', {auth, nextUrl});
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/secret');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/secret', nextUrl));
            }
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;