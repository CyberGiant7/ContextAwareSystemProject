import {parchi_e_giardini} from "@/lib/definitions";

/**
 * Fetches all parks and gardens data from the API.
 *
 * @returns {Promise<parchi_e_giardini[]>} A promise that resolves to an array of parks and gardens data.
 * If an error occurs, it returns an empty array.
 */
export async function getAllParchiEGiardini(): Promise<parchi_e_giardini[]> {
    try {
        const response = await fetch('api/parchi_e_giardini', {
            cache: 'force-cache'
        });
        return await response.json() as parchi_e_giardini[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}