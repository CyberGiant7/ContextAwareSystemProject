import {fermate_autobus} from "@/lib/definitions";

/**
 * Fetches all bus stops from the API.
 *
 * @returns {Promise<fermate_autobus[]>} A promise that resolves to an array of bus stops.
 * If an error occurs, it returns an empty array.
 */
export async function getAllFermateAutobus(): Promise<fermate_autobus[]> {
    try {
        const response = await fetch('api/fermate_autobus', {
            cache: 'force-cache'
        });
        return await response.json() as fermate_autobus[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}