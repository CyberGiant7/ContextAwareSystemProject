import {equidistant_points} from "@/lib/definitions";

/**
 * Fetches all equidistant points for a given email and optional radius.
 *
 * @param {string} email - The email address to fetch equidistant points for.
 * @param {string} [radius] - The optional radius to filter the equidistant points.
 * @returns {Promise<equidistant_points[]>} A promise that resolves to an array of equidistant points.
 */
export async function getAllEquidistantPoints(email: string, radius: string): Promise<equidistant_points[]> {
    try {
        let url = `api/equidistant_points?email=${email}${radius ? '&radius=' + radius : ''}`
        const response = await fetch(url);
        return await response.json() as equidistant_points[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
