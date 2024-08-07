import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {authConfig} from './auth.config';

import {getUser} from "@/queries/user";


export const {auth, signIn, signOut} = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                let email = credentials.email;
                const user = await getUser(email as string);
                if (!user){
                    return null;
                } else {
                    return user
                }
            },
        }),
    ],
});