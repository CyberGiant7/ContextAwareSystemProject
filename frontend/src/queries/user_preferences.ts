import {user_preferences} from "@/lib/definitions";

export async function getUserPreferences(email: string) {
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

export async function createUserPreferences(userPreferences: user_preferences) {
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