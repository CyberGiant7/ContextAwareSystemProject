import {bar_ristoranti} from "@/lib/definitions";

/**
 * Fetches all bar and ristorante data from the API.
 *
 * @returns {Promise<bar_ristoranti[]>} A promise that resolves to an array of bar_ristoranti objects.
 * If an error occurs, it returns an empty array.
 */
export async function getAllBarRistoranti(): Promise<bar_ristoranti[]> {
    try {
        const response = await fetch('api/bar_ristoranti', {
            cache: 'force-cache'
        });
        return await response.json() as bar_ristoranti[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}