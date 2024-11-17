import {user} from "@/lib/definitions";


/**
 * Fetches a user by email.
 *
 * @param {string} email - The email of the user to fetch.
 * @returns {Promise<user | undefined>} The user object if found, otherwise undefined.
 * @throws {Error} If an error occurs while fetching the user.
 */
export async function getUser(email: string): Promise<user | undefined> {
    try {
        const response = await fetch(`${process.env.BACKEND_API_URL}/user?email=${email}`);

        if (response.ok) {
            let users: user[] = await response.json();
            return users[0];
        } else {
            return undefined;
        }
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

/**
 * Creates a new user.
 *
 * @param {user} user - The user object to create.
 * @returns {Promise<Response>} The response from the server.
 * @throws {Error} If an error occurs while creating the user.
 */
export async function createUser(user: user): Promise<Response> {
    try {
        return await fetch('api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
    } catch (error) {
        console.error('Failed to create user:', error);
        throw new Error('Failed to create user.');
    }
}