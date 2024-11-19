import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import * as schema from "../../db/schema";
import {teatri_cinema} from "../../db/schema";
import {count, eq, InferSelectModel, sql} from "drizzle-orm";


// List of table names to be used for ranking
const TABLE_NAMES = ['bar_ristoranti', 'biblioteche', 'farmacie', 'fermate_autobus', 'palestre',
    'parcheggi', 'parchi_e_giardini', 'scuole', 'strutture_sanitarie', 'supermercati', 'teatri_cinema'];

// Interface for a ranked zone, extending the zone_urbanistiche schema
interface RankedZona extends InferSelectModel<typeof schema.zone_urbanistiche> {
    rank: number;
}

/**
 * Ranks zones based on user preferences and data from various tables.
 *
 * @param {PostgresJsDatabase<typeof schema>} db - The database connection.
 * @param {InferSelectModel<typeof schema.zone_urbanistiche>[]} zone_list - List of zones to rank.
 * @param {InferSelectModel<typeof schema.user_preferences>} preferences - User preferences for ranking.
 * @returns {Promise<RankedZona[]>} - A promise that resolves to a list of ranked zones.
 */
export const rankZone = async (
    db: PostgresJsDatabase<typeof schema>,
    zone_list: InferSelectModel<typeof schema.zone_urbanistiche>[],
    preferences: InferSelectModel<typeof schema.user_preferences>,
): Promise<RankedZona[]> => {
    // Initialize an empty array to store the ranked zones
    let sorted_zone: RankedZona[] = [];

    // Iterate over each zone in the zone list
    for (let zona of zone_list) {
        // Initialize the score for the current zone
        let score = 0;

        // Iterate over each table name in TABLE_NAMES
        for (const tableName of TABLE_NAMES) {
            // Construct a query to count the number of entries in the current table
            const query = db.select({value: count()})
                .from(sql`${sql.identifier(tableName)}`)
                .where(eq(sql.raw(`${tableName}.zona_di_prossimita`), zona.zona_di_prossimita));

            // Execute the query and get the result
            const result = await query.execute();

            // Get the user preference for the current table
            let quantityPreference = preferences[('quantity_' + tableName) as keyof typeof preferences] as number;

            // Update the score based on the result and user preference
            score += result[0].value * quantityPreference;
        }

        // Create a ranked zone object with the calculated score
        let ranked_zona: RankedZona = {...zona, rank: score}

        // Add the ranked zone to the sorted_zone array
        add(ranked_zona, sorted_zone);
    }

    // Normalize rank values to a range between 0 and 100
    let max = sorted_zone[0].rank;
    let min = 0;
    for (let zona of sorted_zone) {
        zona.rank = (zona.rank - min) / (max - min) * 100;
    }

    // Return the sorted and ranked zones
    return sorted_zone;
}

/**
 * Adds an element to the array in a sorted order based on the rank property.
 *
 * @param {any} element - The element to add.
 * @param {any[]} array - The array to which the element should be added.
 * @returns {any[]} - The array with the new element added.
 */
function add(element: any, array: any[]) {
    array.splice(findLoc(element, array) + 1, 0, element);
    return array;
}

/**
 * Finds the location to insert an element in a sorted array based on the rank property.
 *
 * @param {any} element - The element to find the location for.
 * @param {any[]} array - The array in which to find the location.
 * @param {number} [st=0] - The start index for the search.
 * @param {number} [en=array.length] - The end index for the search.
 * @returns {number} - The index at which the element should be inserted.
 */
function findLoc(element: any, array: any[], st?: number, en?: number) {
    st = st || 0;
    en = en || array.length;
    for (let i = 0; i < array.length; i++) {
        if (array[i].rank < element.rank)
            return i - 1;
    }
    return en;
}