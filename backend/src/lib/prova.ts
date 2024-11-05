import * as schema from "../../db/schema";

import {drizzle} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as equidistant from '../../data/equidistant_points.json'
import {geomFromGeoJSON} from "drizzle-postgis/functions";

let dbUrl = process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.DEVELOPMENT_DATABASE_URL;

// for query purposes
export const queryClient = postgres(dbUrl as string, {password: "postgres", user: "postgres"});
const db = drizzle(queryClient, {schema});

const main = () => {
    // const query = db.select({
    //     'civ_key': immobili.civ_key,
    //     'count': count(),
    //     'avg': avg(sql`ST_Distance
    //         (st_transform(${immobili.geo_point},32611), st_transform(${bar_ristoranti.geo_point},32611))`)
    // })
    //     .from(immobili)
    //     .leftJoin(bar_ristoranti,
    //         sql`ST_DWithin
    //         (ST_Transform(${immobili}.geo_point, 32611), ST_Transform(${bar_ristoranti}.geo_point, 32611), 1000)`)
    //     .groupBy(immobili.civ_key)
    //
    // let result = query.execute().then(console.log)
    // let preference;
    // db.select().from(schema.user_preferences).where(sql`email = ${'leonardo.dessi18@gmail.com'}`).execute().then(res => {
    //     // db.select().from(schema.immobili).where(eq(schema.immobili.quartiere, 'Santo Stefano')).execute().then(res2 => {
    //     db.select().from(schema.immobili).execute().then(res2 => {
    //         rankImmobili(db, res2, res[0]).then(res => console.log(res))
    //     })
    // })

    // insert all the equidistant points to the db
    let list: any[] = [];
    for (let i = 0; i < equidistant.features.length; i++) {
        let geo_point = geomFromGeoJSON(equidistant.features[i].geometry)
        list.push({codice: i, geo_point: geo_point})
    }
    db.insert(schema.equidistant_points).values(list).onConflictDoNothing().execute().then(console.log)

    // db.insert(schema.equidistant_points).values(equidistant).onConflictDoNothing().execute().then(console
    return;
}

main()
