import {count, InferSelectModel, min, sql} from "drizzle-orm";
import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import * as schema from "../../db/schema";


const RADIUS_METERS = 500;
const TABLE_NAMES = ['bar_ristoranti', 'biblioteche', 'farmacie', 'fermate_autobus', 'palestre', 'parcheggi', 'parchi_e_giardini', 'scuole', 'strutture_sanitarie', 'supermercati', 'teatri_cinema'];
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

export interface RankedImmobile extends InferSelectModel<typeof schema.immobili> {
    rank: number;
}

async function getPOIDistances(db: PostgresJsDatabase<typeof schema>,
                               immobile: InferSelectModel<typeof schema.immobili>,
                               tableName: string,
                               radius: number): Promise<number[]> {
    const distance_table = sql.identifier('distance_from_immobili_to_' + tableName);
    const query = sql`select ${distance_table}.distance
                      from ${distance_table}
                      where immobili = ${immobile.civ_key}
                        and distance <= ${radius}
                      order by distance`;
    let result = await db.execute(query);
    // console.log(result);
    if (result.length === 1 && result[0]['distance'] === null) {
        return [];
    }
    return result.map(res => res['distance'] as number);
}


function calculateProximityScoreSigmoid(distance: number, maxDistance: number) {
    if (distance > maxDistance) return 0;
    // Funzione sigmoide per il calcolo del punteggio
    const k = 8 / maxDistance; // Regola la pendenza della sigmoide
    return 100 / (1 + Math.exp(k * (distance - maxDistance / 2)));
}

function calculateQuantityScore(poiCount: number, desiredQuantity: number) {
    // score between 0 and 100
    return 100 * Math.min(poiCount / desiredQuantity, 1);
}

function calculateProximityScore(poiDistances: number[], maxDistance: number) {
    let quantity = 0;
    let totalScore = 0;
    for (let i = 0; i < poiDistances.length; i++) {
        const proximityScore = calculateProximityScoreSigmoid(poiDistances[i], maxDistance);
        if (proximityScore >= 50) {
            quantity++;
            totalScore += proximityScore;
        }
    }
    return quantity ? totalScore / quantity : 0;
}


export const rankImmobili2 = async (
    db: PostgresJsDatabase<typeof schema>,
    immobili_list: InferSelectModel<typeof schema.immobili>[],
    preferences: InferSelectModel<typeof schema.user_preferences>,
    radius: number = RADIUS_METERS
): Promise<RankedImmobile[]> => {
    const rankedImmobiliPromises = immobili_list.map(async (immobile) => {
        let score = 0;
        for (const tableName of TABLE_NAMES) {
            const distances = await getPOIDistances(db, immobile, tableName, radius);
            const proximityScore = calculateProximityScore(distances, radius);
            const quantityScore = calculateQuantityScore(distances.length, DESIRED_QUANTITY[tableName as keyof typeof DESIRED_QUANTITY]);
            // console.log(tableName, proximityScore, quantityScore);

            const proximityPreference = preferences[('proximity_' + tableName) as keyof typeof preferences] as number +1;
            const quantityPreference = preferences[('quantity_' + tableName) as keyof typeof preferences] as number +1;
            score += (proximityScore * proximityPreference + quantityScore * quantityPreference) / (proximityPreference + quantityPreference)
        }
        score = score / TABLE_NAMES.length;

        return {...immobile, rank: score} as RankedImmobile;
    });

    // Resolve all promises concurrently and then sort the results
    const rankedImmobili = await Promise.all(rankedImmobiliPromises);
    return rankedImmobili.sort((a, b) => b.rank - a.rank);
};

export const rankImmobili = async (
    db: PostgresJsDatabase<typeof schema>,
    immobili_list: InferSelectModel<typeof schema.immobili>[],
    preferences: InferSelectModel<typeof schema.user_preferences>,
    radius: number = RADIUS_METERS
): Promise<RankedImmobile[]> => {
    try {
        const ranks: Map<string, number> = new Map<string, number>();
        const poiData = await Promise.all(TABLE_NAMES.map(tableName => getPOIData(db, tableName, radius)));

        const mergedData = new Map<string, any>();
        poiData.forEach(data => {
            data.forEach((value, key) => {
                mergedData.set(key, { ...mergedData.get(key), ...value });
            });
        });

        const maxCountMap = new Map<string, number>();
        mergedData.forEach(value => {
            Object.keys(value).forEach(key => {
                if (key.includes('count')) {
                    maxCountMap.set(key, Math.max(maxCountMap.get(key) || 0, value[key]));
                }
            });
        });

        mergedData.forEach((value, civ_key) => {
            const totalScore = TABLE_NAMES.reduce((score, tableName) => {
                const minDistKey = `${tableName}_min_distance`;
                const countKey = `${tableName}_count`;
                return score + calculateScore(
                    { min_distance: value[minDistKey], count: value[countKey] },
                    preferences[`proximity_${tableName}` as keyof typeof preferences] as number,
                    preferences[`quantity_${tableName}`as keyof typeof preferences] as number,
                    maxCountMap.get(countKey as string) || 0,
                    radius
                );
            }, 0);
            ranks.set(civ_key, totalScore / TABLE_NAMES.length);
        });

        return immobili_list.map(immobile => ({
            ...immobile,
            rank: ranks.get(immobile.civ_key) || 0
        })).sort((a, b) => b.rank - a.rank);
    } catch (e) {
        console.log(e);
        return [];
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
    results.forEach(({ civ_key, count, min_distance }) => {
        if (min_distance === null) count = 0;
        dict.set(civ_key, { [`${tableName}_count`]: count, [`${tableName}_min_distance`]: min_distance });
    });
    return dict;
};

