'use server'

import {signIn, signOut} from '@/auth';
import {AuthError} from '@auth/core/errors';
import {checkCredential} from "@/lib/checkCredential";


/**
 * Authenticates a user based on the provided form data.
 *
 * @param {string | undefined} prevState - The previous state of the authentication process.
 * @param {FormData} formData - The form data containing user credentials.
 * @returns {Promise<string | void>} - A promise that resolves to a string message or void.
 * @throws {Error} - Throws an error if the authentication process fails.
 */
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        let result = await checkCredential(formData);
        if (!result) {
            return 'Invalid credentials.';
        }
        return await signIn('credentials', {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            redirect: true,
            redirectTo: "/survey",
        });

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

/**
 * Handles the sign-out process for the user.
 * This function uses the server to sign out the user asynchronously.
 */
export const handleSignOut = async () => {
    await signOut();
}