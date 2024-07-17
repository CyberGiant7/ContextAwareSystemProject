import NextAuth, {DefaultSession} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {authConfig} from './auth.config';
import {z} from 'zod';
import {User} from "@/app/lib/definitions";
import bcrypt from 'bcryptjs';



async function getUser(email: string) {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/user?email=${email}`);
        if (response.ok) {
            let users: User[] = await response.json();
            return users[0];
        } else {
            return undefined;
        }
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const {auth, signIn, signOut} = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials, req) {
                // console.log('authorize', credentials);
                const parsedCredentials = z
                    .object({email: z.string().email(), password: z.string().min(6)})
                    .safeParse(credentials);
                // console.log('parsedCredentials', parsedCredentials);
                if (parsedCredentials.success) {
                    const {email, password} = parsedCredentials.data;
                    // console.log('email', email);
                    const user = await getUser(email);
                    // console.log('user', user);

                    if (!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password as string);

                    // console.log('password', password);
                    // console.log('user_password', user.password);

                    if (passwordsMatch) {
                        return user;
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});