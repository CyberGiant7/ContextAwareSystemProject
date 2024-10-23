import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import * as schema from "../../db/schema";
import {count, eq, InferSelectModel, sql} from "drizzle-orm";
import {PgDialect} from 'drizzle-orm/pg-core';


const TABLE_NAMES = ['bar_ristoranti', 'biblioteche', 'farmacie', 'fermate_autobus', 'palestre', 'parcheggi', 'parchi_e_giardini', 'scuole', 'strutture_sanitarie', 'supermercati'];

interface RankedZona extends InferSelectModel<typeof schema.zone_urbanistiche>{
    rank: number;
}

export const rankZone = async (
    db: PostgresJsDatabase<typeof schema>,
    zone_list: InferSelectModel<typeof schema.zone_urbanistiche>[],
    preferences: InferSelectModel<typeof schema.user_preferences>,
): Promise<RankedZona[]> => {
    let sorted_zone: RankedZona[] = [];
    for (let zona of zone_list) {
        let score = 0;
        for (const tableName of TABLE_NAMES) {
            const query = db.select({value: count()})
                .from(sql`${sql.identifier(tableName)}`)
                .where(eq(sql.raw(`${tableName}.zona_di_prossimita`), zona.zona_di_prossimita));
            // const pgDialect = new PgDialect();
            // console.log(pgDialect.sqlToQuery(query.getSQL()))
            const result = await query.execute();
            // console.log(result)

            let quantityPreference = preferences[('quantity_' + tableName) as keyof typeof preferences] as number;
            score += result[0].value * quantityPreference;
        }

        let ranked_zona: RankedZona = {...zona, rank: score}
        add(ranked_zona, sorted_zone);
    }
    // normalize rank values to a range between 0 and 100
    let max = sorted_zone[0].rank;
    let min = 0;
    for (let zona of sorted_zone) {
        zona.rank = (zona.rank - min) / (max - min) * 100;
    }

    return sorted_zone;
}

function add(element:any, array: any[]) {
    array.splice(findLoc(element, array) + 1, 0, element);
    return array;
}

function findLoc(element: any, array:any[], st?:number, en?:number) {
    st = st || 0;
    en = en || array.length;
    for (let i = 0; i < array.length; i++) {
        if (array[i].rank < element.rank)
            return i - 1;
    }
    return en;
}