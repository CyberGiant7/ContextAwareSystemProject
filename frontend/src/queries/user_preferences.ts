import {user_preferences} from "@/lib/definitions";

/**
 * Fetches the user preferences for a given email.
 *
 * @param {string} email - The email of the user whose preferences are to be fetched.
 * @returns {Promise<user_preferences | undefined>} A promise that resolves to the user preferences or undefined if not found.
 * @throws {Error} If the fetch operation fails.
 */
export async function getUserPreferences(email: string): Promise<user_preferences | undefined> {
    try {
        const response = await fetch(`api/user_preferences?email=${email}`);
        if (response.ok) {
            let userPreferences: user_preferences[] = await response.json();
            return userPreferences[0];
        } else {
            return undefined;
        }
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

/**
 * Creates new user preferences.
 *
 * @param {user_preferences} userPreferences - The user preferences to be created.
 * @returns {Promise<Response>} A promise that resolves to the response of the fetch operation.
 * @throws {Error} If the fetch operation fails.
 */
export async function createUserPreferences(userPreferences: user_preferences): Promise<Response> {
    try {
        return await fetch('api/user_preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userPreferences),
        });
    } catch (error) {
        console.error('Failed to create user:', error);
        throw new Error('Failed to create user.');
    }
}