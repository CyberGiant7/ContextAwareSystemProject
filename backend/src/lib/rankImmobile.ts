import {count, InferSelectModel, min, sql} from "drizzle-orm";
import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import * as schema from "../../db/schema";


// Define the radius in meters for proximity calculations
const RADIUS_METERS = 500;

// List of table names representing different points of interest (POI)
const TABLE_NAMES = [
    'bar_ristoranti', 'biblioteche', 'farmacie', 'fermate_autobus', 'palestre',
    'parcheggi', 'parchi_e_giardini', 'scuole', 'strutture_sanitarie',
    'supermercati', 'teatri_cinema'
];

// Desired quantity of each type of POI for ranking purposes
const DESIRED_QUANTITY = {
    bar_ristoranti: 5,
    biblioteche: 3,
    farmacie: 2,
    fermate_autobus: 3,
    palestre: 2,
    parcheggi: 2,
    parchi_e_giardini: 2,
    scuole: 2,
    strutture_sanitarie: 2,
    supermercati: 3,
    teatri_cinema: 2
}

// Interface representing a ranked immobile with a rank property
export interface RankedImmobile extends InferSelectModel<typeof schema.immobili> {
    rank: number;
}

/**
 * Fetches the distances to points of interest (POI) from the database for a given immobile.
 *
 * @param db - The database instance to use for the query.
 * @param immobile - The immobile for which to fetch distances.
 * @param tableName - The name of the table containing POI data.
 * @param radius - The maximum distance to consider for fetching POIs.
 * @returns A promise that resolves to an array of distances to POIs within the specified radius.
 */
async function getPOIDistances(
    db: PostgresJsDatabase<typeof schema>,
    immobile: InferSelectModel<typeof schema.immobili>,
    tableName: string,
    radius: number
): Promise<number[]> {
    // Create an identifier for the distance table
    const distanceTable = sql.identifier(`distance_from_immobili_to_${tableName}`);
    // Define the SQL query to fetch distances from the distance table
    const query = sql`
        SELECT ${distanceTable}.distance
        FROM ${distanceTable}
        WHERE immobili = ${immobile.civ_key}
          AND distance <= ${radius}
        ORDER BY distance`;
    // Execute the query and store the result
    const result = await db.execute(query);

    // Check if the result contains only one row with a null distance
    if (result.length === 1 && result[0].distance === null) {
        // Return an empty array if the distance is null
        return [];
    }

    // Map the result rows to an array of distances and return it
    return result.map(row => row.distance as number);
}


/**
 * Calculate the proximity score using a sigmoid function.
 * The score is a value between 0 and 100, based on the distance to a point of interest.
 *
 * @param distance - The distance to the point of interest.
 * @param maxDistance - The maximum distance to consider for scoring.
 * @returns The proximity score, a value between 0 and 100.
 */
function calculateProximityScoreSigmoid(distance: number, maxDistance: number) {
    if (distance > maxDistance) return 0; // Return 0 if the distance is greater than the maximum distance
    const k = 8 / maxDistance; // Adjust the slope of the sigmoid function
    return 100 / (1 + Math.exp(k * (distance - maxDistance / 2))); // Calculate the sigmoid score
}

/**
 * Calculate the quantity score for a given number of points of interest (POI).
 * The score is a value between 0 and 100, based on the ratio of the actual POI count to the desired quantity.
 *
 * @param poiCount - The actual number of points of interest.
 * @param desiredQuantity - The desired quantity of points of interest.
 * @returns The quantity score, a value between 0 and 100.
 */
function calculateQuantityScore(poiCount: number, desiredQuantity: number) {
    // Calculate the score as a percentage of the desired quantity, capped at 100%
    return 100 * Math.min(poiCount / desiredQuantity, 1);
}

/**
 * Calculate the average proximity score for a list of POI distances.
 * Only scores that are 50 or higher are considered significant.
 *
 * @param poiDistances - Array of distances to points of interest.
 * @param maxDistance - Maximum distance to consider for scoring.
 * @returns The average proximity score if there are significant scores, otherwise 0.
 */
function calculateProximityScore(poiDistances: number[], maxDistance: number): number {
    let count = 0; // Initialize count of POIs with significant scores
    let cumulativeScore = 0; // Initialize cumulative score

    for (const distance of poiDistances) {
        const score = calculateProximityScoreSigmoid(distance, maxDistance); // Calculate score using sigmoid function
        if (score >= 50) { // Consider only scores that are 50 or higher
            count++; // Increment count of significant scores
            cumulativeScore += score; // Add score to cumulative score
        }
    }
    return count > 0 ? cumulativeScore / count : 0; // Return average score if count > 0, otherwise return 0
}


/**
 * Rank a list of immobili by their proximity and quantity to points of interest within a given radius.
 * @param db The database to use.
 * @param immobili_list The list of immobili to rank.
 * @param preferences The preferences of the user.
 * @param radius The radius to use for ranking.
 * @returns The ranked list of immobili.
 */
export const rankImmobili2 = async (
    db: PostgresJsDatabase<typeof schema>,
    immobili_list: InferSelectModel<typeof schema.immobili>[],
    preferences: InferSelectModel<typeof schema.user_preferences>,
    radius: number = RADIUS_METERS
): Promise<RankedImmobile[]> => {
    const rankedImmobiliPromises = immobili_list.map(async (immobile) => {
        let score = 0;

        for (const tableName of TABLE_NAMES) {
            // Fetch distances to points of interest from the database
            const distances = await getPOIDistances(db, immobile, tableName, radius);

            // Calculate proximity and quantity scores
            const proximityScore = calculateProximityScore(distances, radius);
            const quantityScore = calculateQuantityScore(distances.length, DESIRED_QUANTITY[tableName as keyof typeof DESIRED_QUANTITY]);

            // Retrieve user preferences for proximity and quantity
            const proximityPreference = preferences[('proximity_' + tableName) as keyof typeof preferences] as number + 1;
            const quantityPreference = preferences[('quantity_' + tableName) as keyof typeof preferences] as number + 1;

            // Aggregate scores weighted by user preferences
            score += (proximityScore * proximityPreference + quantityScore * quantityPreference) / (proximityPreference + quantityPreference);
        }

        // Normalize score by the number of table names
        score = score / TABLE_NAMES.length;

        // Return the immobile with its calculated rank
        return {...immobile, rank: score} as RankedImmobile;
    });

    // Resolve all promises concurrently and sort the results by rank in descending order
    const rankedImmobili = await Promise.all(rankedImmobiliPromises);
    return rankedImmobili.sort((a, b) => b.rank - a.rank);
};

/**
 * Rank a list of immobili by their proximity and quantity to points of interest within a given radius.
 * @param db The database to use.
 * @param immobili_list The list of immobili to rank.
 * @param preferences The preferences of the user.
 * @param radius The radius to use for ranking.
 * @returns The ranked list of immobili.
 */
export const rankImmobili = async (
    db: PostgresJsDatabase<typeof schema>,
    immobili_list: InferSelectModel<typeof schema.immobili>[],
    preferences: InferSelectModel<typeof schema.user_preferences>,
    radius: number = RADIUS_METERS
): Promise<RankedImmobile[]> => {
    try {
        const ranks: Map<string, number> = new Map<string, number>(); // Map to store ranks for each immobile
        const poiData = await Promise.all(TABLE_NAMES.map(tableName => getPOIData(db, tableName, radius))); // Fetch POI data for each table

        // Merge the poi data into a single map with the civ_key as key
        const mergedData = new Map<string, any>();
        poiData.forEach(data => {
            data.forEach((value, key) => {
                mergedData.set(key, {...mergedData.get(key), ...value}); // Merge data for each immobile
            });
        });

        // Find the maximum count for each table
        const maxCountMap = new Map<string, number>();
        mergedData.forEach(value => {
            Object.keys(value).forEach(key => {
                if (key.includes('count')) {
                    maxCountMap.set(key, Math.max(maxCountMap.get(key) || 0, value[key])); // Track maximum count for each POI type
                }
            });
        });

        // Calculate the score for each immobile
        mergedData.forEach((value, civ_key) => {
            const totalScore = TABLE_NAMES.reduce((score, tableName) => {
                const minDistKey = `${tableName}_min_distance`; // Key for minimum distance
                const countKey = `${tableName}_count`; // Key for count
                return score + calculateScore(
                    {min_distance: value[minDistKey], count: value[countKey]}, // POI data
                    preferences[`proximity_${tableName}` as keyof typeof preferences] as number, // User preference for proximity
                    preferences[`quantity_${tableName}` as keyof typeof preferences] as number, // User preference for quantity
                    maxCountMap.get(countKey as string) || 0, // Maximum count for normalization
                    radius // Radius for proximity calculation
                );
            }, 0);
            ranks.set(civ_key, totalScore / TABLE_NAMES.length); // Average score across all POI types
        });

        // Return the ranked list of immobili
        return immobili_list.map(immobile => ({
            ...immobile,
            rank: ranks.get(immobile.civ_key) || 0 // Assign rank to each immobile
        })).sort((a, b) => b.rank - a.rank); // Sort by rank in descending order
    } catch (e) {
        console.log(e); // Log any errors
        return []; // Return an empty array in case of error
    }
};

const calculateScore = (
    poiData: { min_distance: number, count: number },
    proximityWeight: number,
    quantityWeight: number,
    maxCount: number,
    radius: number = RADIUS_METERS
): number => {
    proximityWeight += 1;
    quantityWeight += 1;

    if (poiData.count === 0) return 0;

    const proximityScore = calculateProximityScoreSigmoid(poiData.min_distance, radius);
    const quantityScore = calculateQuantityScore(poiData.count, maxCount);

    return (proximityScore * proximityWeight + quantityScore * quantityWeight) / (proximityWeight + quantityWeight);
};

const getPOIData = async (
    db: PostgresJsDatabase<typeof schema>,
    tableName: string,
    radius: number = RADIUS_METERS
): Promise<Map<string, any>> => {
    const query = db.select({
        civ_key: schema.immobili.civ_key,
        count: count(),
        min_distance: min(sql.raw(`ST_Distance(ST_Transform(immobili.geo_point, 32611), ST_Transform(${tableName}.geo_point, 32611))`))
    })
        .from(schema.immobili)
        .leftJoin(sql.raw(tableName), sql.raw(`ST_DWithin(ST_Transform(immobili.geo_point, 32611), ST_Transform(${tableName}.geo_point, 32611), ${radius})`))
        .groupBy(schema.immobili.civ_key);

    const results = await query.execute();
    const dict = new Map<string, any>();
    results.forEach(({civ_key, count, min_distance}) => {
        if (min_distance === null) count = 0;
        dict.set(civ_key, {[`${tableName}_count`]: count, [`${tableName}_min_distance`]: min_distance});
    });
    return dict;
};

