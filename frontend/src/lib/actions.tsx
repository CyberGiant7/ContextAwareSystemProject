'use server'

import {signIn} from '@/auth';
import {AuthError} from '@auth/core/errors';
import {checkCredential} from "@/lib/checkCredential";


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
                redirectTo: "/survey",
            });
            return response;
        }
    } catch (error) {
        if (error instanceof AuthError) {
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