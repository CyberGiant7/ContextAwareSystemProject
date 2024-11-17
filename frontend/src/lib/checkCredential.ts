import {z} from "zod";
import bcrypt from "bcryptjs";
import {getUser} from "@/queries/user";
import {AccessDenied, AuthError} from "@auth/core/errors";
import {user} from "@/lib/definitions";


/**
 * Checks the provided credentials against the stored user data.
 *
 * @param {FormData} formData - The form data containing email and password.
 * @returns {Promise<user|null>} - Returns the user object if credentials are valid, otherwise null.
 * @throws {AuthError} - Throws an error if fetching the user fails.
 * @throws {AccessDenied} - Throws an error if the credentials are invalid.
 */
export async function checkCredential(formData: FormData): Promise<user | null> {
    // Parse and validate the credentials from the form data
    const parsedCredentials = z
        .object({email: z.string().email(), password: z.string().min(6)})
        .safeParse({email: formData.get('email'), password: formData.get('password')});

    // If parsing fails, return null
    if (!parsedCredentials.success) {
        return null;
    }

    // Extract email and password from parsed credentials
    const {email, password} = parsedCredentials.data;
    let user: user | undefined;
    try {
        // Fetch the user by email
        user = await getUser(email);
    } catch (error) {
        // Throw an error if fetching the user fails
        throw new AuthError('Failed to fetch user.');
    }

    // If user is not found, return null
    if (!user) return null;

    // Compare the provided password with the stored hashed password
    const passwordsMatch = await bcrypt.compare(password, user.password as string);

    // If passwords match, return the user object
    if (passwordsMatch) {
        return user;
    } else {
        // Throw an error if credentials are invalid
        throw new AccessDenied("Invalid credentials");
    }
}