import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import * as schema from "../../db/schema";
import {InferSelectModel, sql, getTableName} from "drizzle-orm";


export async function seedDistancesTable(db: PostgresJsDatabase<typeof schema>,
                                         immobili: InferSelectModel<typeof schema.immobili>[]) {

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

    for (const [table, items] of Object.entries(tables)) {
        const key = items.key
        const schema = items.schema
        // if (table !== 'farmacie') {
        //     continue
        // }
        const query =
            sql`select immobili.civ_key as immobili,
                       ${sql.identifier(table)}.${sql.identifier(key)} as ${sql.identifier(table)},
                       st_distance(ST_Transform(immobili.geo_point, 32611),
                                   ST_Transform(${sql.identifier(table)}.geo_point, 32611)) as distance
                from immobili,
                     ${sql.identifier(table)}`

        const result = await db.execute(query)
        console.log(`Inserting ${result.length} rows into ${getTableName(schema)}`)
        // console.log(results)
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

