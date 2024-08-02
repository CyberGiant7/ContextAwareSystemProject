'use server'

import {signIn} from '@/auth';
import {AuthError} from '@auth/core/errors';
import {redirect} from 'next/navigation'
import {checkCredential} from "@/app/lib/checkCredential";


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        let result = await checkCredential(formData);
        if (result) {
            let response = await signIn('credentials', {
                email: formData.get('email') as string,
                password: formData.get('password') as string,
                redirect: true,
                redirectTo: "/secret",
            });
            console.log("signin response: ", response);
            return response;
        }
    } catch (error) {
        if (error instanceof AuthError) {
            console.log("error Type", error.type);
            switch (error.type) {
                case 'AccessDenied':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}