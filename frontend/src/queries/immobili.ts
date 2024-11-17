import {immobile} from "@/lib/definitions";

/**
 * Fetches all immobili based on the provided options.
 *
 * @param {Object} options - The options for fetching immobili.
 * @param {boolean} options.orderByRank - Whether to order by rank.
 * @param {string[]} [options.zone] - The zones to filter by.
 * @param {string} [options.email] - The email required if ordering by rank.
 * @param {string} [options.radius] - The radius to filter by.
 * @param {string} [options.rankMode] - The rank mode to use.
 * @returns {Promise<immobile[]>} A promise that resolves to an array of immobili.
 * @throws {Error} If email is not provided when orderByRank is true.
 */
export async function getAllImmobili(options: {
    orderByRank: boolean,
    zone?: string[],
    email?: string,
    radius?: string,
    rankMode?: string
}): Promise<immobile[]> {
    const { orderByRank, zone, email, radius, rankMode } = options;

    try {
        const urlParams = new URLSearchParams();

        // Add zone parameters, if present
        if (zone && zone.length > 0) {
            zone.forEach(z => urlParams.append('zona', z));
        }

        // Add parameters for ordering and filtering
        if (orderByRank) {
            if (!email) {
                throw new Error('Email is required');
            }
            urlParams.append('order', 'rank');
            urlParams.append('email', email);
            if (radius) urlParams.append('radius', radius);
            if (rankMode) urlParams.append('rank_mode', rankMode);
        }

        // Construct the final URL
        const url = `api/immobili?${urlParams.toString()}`;

        const response = await fetch(url, {
            cache: 'force-cache'
        });
        return await response.json() as immobile[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
