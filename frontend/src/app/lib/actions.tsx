'use server'

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation'

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    // console.log('formData', formData);
    // console.log("email", formData.get('email'));
    // console.log("password", formData.get('password'));
    try {
        await signIn('credentials', {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            redirectTo: "/secret",
            redirect: true,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}