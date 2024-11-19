import {count, InferSelectModel, min, sql} from "drizzle-orm";
import * as schema from "../../db/schema";
import {PostgresJsDatabase} from "drizzle-orm/postgres-js";

const RADIUS_METERS = 250;
const TABLE_NAMES = ['bar_ristoranti', 'biblioteche', 'farmacie', 'fermate_autobus', 'palestre', 'parcheggi', 'parchi_e_giardini', 'scuole', 'strutture_sanitarie', 'supermercati', 'teatri_cinema'];

interface RankedPoint extends InferSelectModel<typeof schema.equidistant_points> {
    rank: number;
}

const calculateProximityScoreSigmoid = (distance: number, maxDistance: number) => {
    if (distance > maxDistance) return 0;
    const k = 8 / maxDistance;
    return 100 / (1 + Math.exp(k * (distance - maxDistance / 2)));
};

const calculateQuantityScore = (poiCount: number, desiredQuantity: number) => {
    return 100 * Math.min(poiCount / desiredQuantity, 1);
};

const getPOIDataForPoints = async (
    db: PostgresJsDatabase<typeof schema>,
    tableName: string,
    radius: number = RADIUS_METERS
): Promise<Map<number, any>> => {
    const query = db.select({
        codice: schema.equidistant_points.codice,
        count: count(),
        min_distance: min(sql.raw(`ST_Distance(ST_Transform(equidistant_points.geo_point, 32611), ST_Transform(${tableName}.geo_point, 32611))`))
    })
        .from(schema.equidistant_points)
        .leftJoin(sql.raw(tableName), sql.raw(`ST_DWithin(ST_Transform(equidistant_points.geo_point, 32611), ST_Transform(${tableName}.geo_point, 32611), ${radius})`))
        .groupBy(schema.equidistant_points.codice);

    const results = await query.execute();
    const dict = new Map<number, any>();
    results.forEach(({codice, count, min_distance}) => {
        if (min_distance === null) count = 0;
        dict.set(codice, {[`${tableName}_count`]: count, [`${tableName}_min_distance`]: min_distance});
    });
    return dict;
};

const calculateScore = (
    poiData: { min_distance: number, count: number },
    proximityWeight: number,
    quantityWeight: number,
    maxCount: number,
    radius: number = RADIUS_METERS
): number => {
    if (poiData.count === 0) return 0;
    if (proximityWeight === 0 && quantityWeight === 0) return 0;

    const proximityScore = calculateProximityScoreSigmoid(poiData.min_distance, radius);
    const quantityScore = calculateQuantityScore(poiData.count, maxCount);

    return (proximityScore * proximityWeight + quantityScore * quantityWeight) / (proximityWeight + quantityWeight);
};

export const rankPoints = async (
    db: PostgresJsDatabase<typeof schema>,
    points_list: InferSelectModel<typeof schema.equidistant_points>[],
    preferences: InferSelectModel<typeof schema.user_preferences>,
    radius: number = RADIUS_METERS
): Promise<RankedPoint[]> => {
    console.log(radius);
    try {
        const ranks: Map<number, number> = new Map<number, number>();
        const poiData = await Promise.all(TABLE_NAMES.map(tableName => getPOIDataForPoints(db, tableName, radius)));

        const mergedData = new Map<number, any>();
        poiData.forEach(data => {
            data.forEach((value, key) => {
                mergedData.set(key, {...mergedData.get(key), ...value});
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

        mergedData.forEach((value, codice) => {
            const totalScore = TABLE_NAMES.reduce((score, tableName) => {
                const minDistKey = `${tableName}_min_distance`;
                const countKey = `${tableName}_count`;
                return score + calculateScore(
                    {min_distance: value[minDistKey], count: value[countKey]},
                    preferences[`proximity_${tableName}` as keyof typeof preferences] as number,
                    preferences[`quantity_${tableName}` as keyof typeof preferences] as number,
                    maxCountMap.get(countKey as string) || 0,
                    radius
                );
            }, 0);
            ranks.set(codice, totalScore / TABLE_NAMES.length);
        });

        let rankedPoints = points_list.map(point => ({
            ...point,
            rank: ranks.get(point.codice) || 0
        })).sort((a, b) => b.rank - a.rank);

        // Normalize rank values to a range between 0 and 100
        let max = rankedPoints[0].rank;

        let min = 0;
        for (let immobile of rankedPoints) {
            immobile.rank = (immobile.rank - min) / (max - min) * 100;
        }
        return rankedPoints; // Return the ranked immobili

    } catch (e) {
        console.log(e);
        return [];
    }
};