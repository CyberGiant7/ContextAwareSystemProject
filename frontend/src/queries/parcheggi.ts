import {parcheggi} from "@/lib/definitions";

/**
 * Fetches all parcheggi data from the API.
 *
 * @returns {Promise<parcheggi[]>} A promise that resolves to an array of parcheggi objects.
 * If an error occurs, it returns an empty array.
 */
export async function getAllParcheggi(): Promise<parcheggi[]> {
    try {
        const response = await fetch('api/parcheggi', {
            cache: 'force-cache'
        });
        return await response.json() as parcheggi[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}