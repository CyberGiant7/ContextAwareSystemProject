import {NextAuthConfig} from "next-auth"
import {DefaultSession} from "@auth/core/types";
import {user} from "@/lib/definitions";
import {NextResponse} from "next/server";


declare module "next-auth" {
    interface Session extends DefaultSession {
        user: user;
    }
    function getCsrfToken(): Promise<string>
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
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        jwt({token, user}) {
            if (user) {
                delete (user as user)["password"];
                token.user = user;
            }
            return token;
        },

        session({session, token}) {
            return {
                ...session,
                user: token.user as user
            }
        },
        authorized({auth, request: {nextUrl}}) {
            const isLoggedIn = !!auth;
            const isOnProfile = nextUrl.pathname.startsWith('/profile');
            const isOnSurvey = nextUrl.pathname.startsWith('/survey');

            if (isOnProfile) {
                return isLoggedIn;
                 // Redirect unauthenticated users to login page
            } else if (isOnSurvey) {
                return isLoggedIn;
            }else {
                return NextResponse.redirect(new URL('/profile', nextUrl));
            }
        },

    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;