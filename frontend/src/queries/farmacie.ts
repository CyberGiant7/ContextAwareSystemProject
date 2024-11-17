import {farmacie} from "@/lib/definitions";

/**
 * Fetches all farmacie data from the API.
 *
 * @returns {Promise<farmacie[]>} A promise that resolves to an array of farmacie objects.
 * If an error occurs, it returns an empty array.
 */
export async function getAllFarmacie(): Promise<farmacie[]> {
    try {
        const response = await fetch('api/farmacie', {
            cache: 'force-cache'
        });
        return await response.json() as farmacie[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}