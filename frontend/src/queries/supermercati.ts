import {supermercati} from "@/lib/definitions";

/**
 * Fetches all supermercati data from the API.
 *
 * @returns {Promise<supermercati[]>} A promise that resolves to an array of supermercati.
 * If an error occurs, it returns an empty array.
 */
export async function getAllSupermercati(): Promise<supermercati[]> {
    try {
        const response = await fetch('api/supermercati', {
            cache: 'force-cache'
        });
        return await response.json() as supermercati[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}