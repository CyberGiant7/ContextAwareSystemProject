export const dynamic = "force-dynamic"
import {zona_urbanistica} from "@/lib/definitions";

/**
 * Fetches the ranked zone data for a given user email.
 *
 * @param {string} user_email - The email of the user to fetch the ranked zone data for.
 * @returns {Promise<zona_urbanistica[]>} - A promise that resolves to an array of zona_urbanistica objects.
 */
export async function getRankedZone(user_email: string): Promise<zona_urbanistica[]> {
    try {
        const response = await fetch('api/zone?order=rank&email=' + user_email, {
            cache: 'force-cache'
        });
        return await response.json() as zona_urbanistica[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

/**
 * Fetches all zone data.
 *
 * @returns {Promise<zona_urbanistica[]>} - A promise that resolves to an array of zona_urbanistica objects.
 */
export async function getAllZone(): Promise<zona_urbanistica[]> {
    try {
        const response = await fetch('api/zone');
        return await response.json() as zona_urbanistica[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}