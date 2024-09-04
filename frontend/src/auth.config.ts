import {NextAuthConfig} from "next-auth"
import {DefaultSession} from "@auth/core/types";
import {user} from "@/lib/definitions";
import {NextResponse} from "next/server";


declare module "next-auth" {
    interface Session extends DefaultSession {
        user: user;
    }
}

export const authConfig = {
    pages: {
        signIn: '/sign-in',
        signOut: '/',
        error: '/error', // Error code passed in query string as ?error=
    },
    trustHost: true,
    callbacks: {
        async signIn({user}) {
            return !!user;
        },
        async redirect({url, baseUrl}) {
            console.log('redirect', {url, baseUrl});
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        jwt({token, user}) {
            // console.log('jwt', {token, user});
            if (user) {
                delete (user as user)["password"];
                token.user = user;
            }
            return token;
        },

        session({session, token}) {
            // console.log('session return', {...session, user: token.user as User});
            return {
                ...session,
                user: token.user as user
            }
        },
        authorized({auth, request: {nextUrl}}) {
            // console.log('authorized', {auth, nextUrl});
            console.log(auth);
            const isLoggedIn = !!auth;
            const isOnSecret = nextUrl.pathname.startsWith('/secret');
            const isOnSurvey = nextUrl.pathname.startsWith('/survey');
            console.log('isOnSurvey', isOnSurvey);
            console.log('isLoggedIn', isLoggedIn);

            if (isOnSecret) {
                return isLoggedIn;
                 // Redirect unauthenticated users to login page
            } else if (isOnSurvey) {
                return isLoggedIn;
            }else {
                console.log("authorized redirecting to", new URL('/secret', nextUrl))
                return NextResponse.redirect(new URL('/secret', nextUrl));
            }
        },

    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;