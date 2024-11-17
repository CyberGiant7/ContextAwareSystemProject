import {strutture_sanitarie} from "@/lib/definitions";

/**
 * Fetches all `strutture_sanitarie` from the API.
 *
 * @returns {Promise<strutture_sanitarie[]>} A promise that resolves to an array of `strutture_sanitarie`.
 * If an error occurs, it returns an empty array.
 */
export async function getAllStruttureSanitarie(): Promise<strutture_sanitarie[]> {
    try {
        const response = await fetch('api/strutture_sanitarie', {
            cache: 'force-cache'
        });
        return await response.json() as strutture_sanitarie[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}