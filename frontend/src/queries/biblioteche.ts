import {biblioteche} from "@/lib/definitions";

/**
 * Fetches all biblioteche from the API.
 *
 * @returns {Promise<biblioteche[]>} A promise that resolves to an array of biblioteche.
 * If an error occurs, it returns an empty array.
 */
export async function getAllBiblioteche(): Promise<biblioteche[]> {
    try {
        const response = await fetch('api/biblioteche', {
            cache: 'force-cache'
        });
        return await response.json() as biblioteche[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}