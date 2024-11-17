import {teatri_cinema} from "@/lib/definitions";

/**
 * Fetches all teatri_cinema data from the API.
 *
 * @returns {Promise<teatri_cinema[]>} A promise that resolves to an array of teatri_cinema objects.
 * If an error occurs, it returns an empty array.
 */
export async function getAllTeatriCinema(): Promise<teatri_cinema[]> {
    try {
        const response = await fetch('api/teatri_cinema', {
            cache: 'force-cache'
        });
        return await response.json() as teatri_cinema[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}