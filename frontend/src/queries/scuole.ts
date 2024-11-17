import {scuole} from "@/lib/definitions";

/**
 * Fetches all scuole data from the API.
 *
 * @returns {Promise<scuole[]>} A promise that resolves to an array of scuole objects.
 * If an error occurs, it returns an empty array.
 */
export async function getAllScuole(): Promise<scuole[]> {
    try {
        const response = await fetch('api/scuole', {
            cache: 'force-cache'
        });
        return await response.json() as scuole[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}