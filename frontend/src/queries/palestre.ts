import {palestre} from "@/lib/definitions";

/**
 * Fetches all 'palestre' data from the API.
 *
 * @returns {Promise<palestre[]>} A promise that resolves to an array of 'palestre' objects.ù
 * If an error occurs, it returns an empty array.
 */
export async function getAllPalestre(): Promise<palestre[]> {
    try {
        const response = await fetch('api/palestre', {
            cache: 'force-cache'
        });
        return await response.json() as palestre[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}