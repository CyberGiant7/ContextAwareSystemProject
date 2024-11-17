import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import * as schema from "../../db/schema";
import {getTableName, sql} from "drizzle-orm";

/**
 * Seeds the distances table by calculating distances between `immobili` and various other tables.
 *
 * @param {PostgresJsDatabase<any>} db - The database connection object.
 */
export async function seedDistancesTable(db: PostgresJsDatabase<any>) {
    // Iterate over each table and calculate distances
    for (const [table, items] of Object.entries(tables)) {
        const key = items.key
        const schema = items.schema

        const table_identifier = sql.identifier(table)
        const key_identifier = sql.identifier(key)
        // Construct the SQL query to calculate distances
        const query =
            sql`select immobili.civ_key                                                as immobili,
                       ${table_identifier}.${key_identifier}                           as ${table_identifier},
                       st_distance(ST_Transform(immobili.geo_point, 32611),
                                   ST_Transform(${table_identifier}.geo_point, 32611)) as distance
                from immobili,
                     ${table_identifier}`

        // Execute the query and get the result
        const result = await db.execute(query)
        console.log(`Inserting ${result.length} distances into ${getTableName(schema)}`)

        // Insert the result into the database in chunks if necessary
        if (result.length > 21800) {
            const chunkSize = 21800;
            for (let i = 0; i < result.length; i += chunkSize) {
                const chunk = result.slice(i, i + chunkSize);
                await db.insert(schema).values(chunk as any[]).onConflictDoNothing().execute();
            }
        } else {
            await db.insert(schema).values(result as any[]).onConflictDoNothing().execute();
        }
    }
}

// Define the tables and their corresponding keys and schemas
const tables = {
    bar_ristoranti: {key: 'codice', schema: schema.distance_from_immobili_to_bar_ristoranti},
    biblioteche: {key: 'codice', schema: schema.distance_from_immobili_to_biblioteche},
    farmacie: {key: 'civ_key', schema: schema.distance_from_immobili_to_farmacie},
    fermate_autobus: {key: 'codice', schema: schema.distance_from_immobili_to_fermate_autobus},
    palestre: {key: 'codice', schema: schema.distance_from_immobili_to_palestre},
    parcheggi: {key: 'codice', schema: schema.distance_from_immobili_to_parcheggi},
    parchi_e_giardini: {key: 'codice', schema: schema.distance_from_immobili_to_parchi_e_giardini},
    scuole: {key: 'civ_key', schema: schema.distance_from_immobili_to_scuole},
    strutture_sanitarie: {key: 'civ_key', schema: schema.distance_from_immobili_to_strutture_sanitarie},
    supermercati: {key: 'codice', schema: schema.distance_from_immobili_to_supermercati},
    teatri_cinema: {key: 'civ_key', schema: schema.distance_from_immobili_to_teatri_cinema}
}