import {asc, avg, count, desc, eq, inArray, InferSelectModel, sql} from "drizzle-orm";
// import {db} from "../../db"
import {PostgresJsDatabase} from "drizzle-orm/postgres-js";
import * as schema from "../../db/schema";


const RADIUS_METERS = 500;
const TABLE_NAMES = ['bar_ristoranti', 'biblioteche', 'farmacie', 'fermate_autobus', 'palestre', 'parcheggi', 'parchi_e_giardini', 'scuole', 'strutture_sanitarie', 'supermercati'];
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
    supermercati: 3
}

// interface RankedProperty {
//     immobile: string;
//     score: number;
// }

async function getPOIDistances(db: PostgresJsDatabase<typeof schema>,
                               immobile: InferSelectModel<typeof schema.immobili>,
                               tableName: string, radius: number): Promise<number[]> {
    const query = db.select(
        {
            distance: sql.raw(`ST_Distance(ST_Transform(immobili.geo_point, 32611), ST_Transform(${tableName + '.geo_point'},32611))`).as('distance'),
        }
    )
        .from(schema.immobili)
        .leftJoin(sql.raw(`${tableName}`),
            sql.raw(`ST_DWithin(ST_Transform(immobili.geo_point, 32611), ST_Transform(${tableName + '.geo_point'},32611), ${radius})`))
        .where(eq(schema.immobili.civ_key, immobile.civ_key))
        .orderBy(asc(sql.identifier('distance')));

    let result = await query.execute()
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
    // L'utente ha espresso una preferenza sul numero di POI (da 1 a 5)
    //Punteggio da 0 a 100
    return 100 * Math.min(poiCount / desiredQuantity, 1);
}


function calculateProximityScore(poiDistances: number[], maxDistance: number) {
    // Seleziona i N POI più vicini

    const N = Math.ceil(poiDistances.length / 4);
    const topNClosestDistances = poiDistances.slice(0, N);

    let quantity = 0;
    let totalScore = 0;
    for (let i = 0; i < poiDistances.length; i++) {
        const proximityScore = calculateProximityScoreSigmoid(poiDistances[i], maxDistance);
        if (proximityScore >= 50) {
            quantity++;
            totalScore += proximityScore;
        }
    }
    const normalizedProximityScore = quantity ? totalScore / quantity : 0;
    // console.log(normalizedProximityScore);

    // Calcola il punteggio medio per i POI più vicini
    // let totalScore = 0;
    // topNClosestDistances.forEach(distance => {
    //     const proximityScore = calculateProximityScoreSigmoid(distance, maxDistance);
    //     totalScore += proximityScore;
    // });

    // Normalizza sul numero di POI considerati
    // const normalizedProximityScore = totalScore / N;

    // Applica il peso delle preferenze dell'utente (da 1 a 5) per la vicinanza
    return normalizedProximityScore;
}


export const rankImmobili = async (
    db: PostgresJsDatabase<typeof schema>,
    immobili_list: InferSelectModel<typeof schema.immobili>[],
    preferences: InferSelectModel<typeof schema.user_preferences>,
    radius: number = RADIUS_METERS
): Promise<Map<string, number>> => {
    const ranks: Map<string, number> = new Map<string, number>();
    for (const immobile of immobili_list) {
        let score = 0;
        for (const tableName of TABLE_NAMES) {
            let distances = await getPOIDistances(db, immobile, tableName, radius);
            let proximityScore = calculateProximityScore(distances, radius);
            let quantityScore = calculateQuantityScore(distances.length, DESIRED_QUANTITY[tableName as keyof typeof DESIRED_QUANTITY]);

            let proximityPreference = preferences[('proximity_' + tableName) as keyof typeof preferences] as number;
            let quantityPreference = preferences[('quantity_' + tableName) as keyof typeof preferences] as number;
            score += proximityPreference * (proximityScore / 5) + quantityPreference * (quantityScore / 5);
        }
        score = score / TABLE_NAMES.length;
        ranks.set(immobile.civ_key, score);
    }
    return ranks;
}


// export const rankImmobili2 = async (
//     db: PostgresJsDatabase<typeof schema>,
//     immobili_list: InferSelectModel<typeof schema.immobili>[],
//     preferences: InferSelectModel<typeof schema.user_preferences>,
//     radius: number = RADIUS_METERS
// ): Promise<Map<string, number>> => {
//
//     try {
//         // const ranks: RankedProperty[] = [];
//         const ranks: Map<string, number> = new Map<string, number>();
//
//         // Calcolare le distanze e le quantità per ogni PoI
//         const [
//             barRistoranti,
//             biblioteche,
//             farmacie,
//             fermateAutobus,
//             palestre,
//             parcheggi,
//             parchiGiardini,
//             scuole,
//             struttureSanitarie,
//             supermercati,
//         ] = await Promise.all([
//             getPOIData(db, immobili_list, 'bar_ristoranti', radius),
//             getPOIData(db, immobili_list, 'biblioteche', radius),
//             getPOIData(db, immobili_list, 'farmacie', radius),
//             getPOIData(db, immobili_list, 'fermate_autobus', radius),
//             getPOIData(db, immobili_list, 'palestre', radius),
//             getPOIData(db, immobili_list, 'parcheggi', radius),
//             getPOIData(db, immobili_list, 'parchi_e_giardini', radius),
//             getPOIData(db, immobili_list, 'scuole', radius),
//             getPOIData(db, immobili_list, 'strutture_sanitarie', radius),
//             getPOIData(db, immobili_list, 'supermercati', radius),
//         ]);
//
//         // merge all map in one where the key is the same
//         let map = new Map();
//
//         barRistoranti.forEach((value, key) => map.set(key, value));
//         biblioteche.forEach((value, key) => map.set(key, {...map.get(key), ...value}));
//         farmacie.forEach((value, key) => map.set(key, {...map.get(key), ...value}));
//         fermateAutobus.forEach((value, key) => map.set(key, {...map.get(key), ...value}));
//         palestre.forEach((value, key) => map.set(key, {...map.get(key), ...value}));
//         parcheggi.forEach((value, key) => map.set(key, {...map.get(key), ...value}));
//         parchiGiardini.forEach((value, key) => map.set(key, {...map.get(key), ...value}));
//         scuole.forEach((value, key) => map.set(key, {...map.get(key), ...value}));
//         struttureSanitarie.forEach((value, key) => map.set(key, {...map.get(key), ...value}));
//         supermercati.forEach((value, key) => map.set(key, {...map.get(key), ...value}));
//
//         map.forEach((value, civ_key) => {
//             // Calcolare i punteggi ponderati
//             const totalScore =
//                 calculateScore({
//                     average_distance: value.bar_ristoranti_average_distance,
//                     count: value.bar_ristoranti_count
//                 }, preferences.proximity_bar_ristoranti, preferences.quantity_bar_ristoranti, radius) +
//                 calculateScore({
//                     average_distance: value.biblioteche_average_distance,
//                     count: value.biblioteche_count
//                 }, preferences.proximity_biblioteche, preferences.quantity_biblioteche, radius) +
//                 calculateScore({
//                     average_distance: value.farmacie_average_distance,
//                     count: value.farmacie_count
//                 }, preferences.proximity_farmacie, preferences.quantity_farmacie, radius) +
//                 calculateScore({
//                     average_distance: value.fermate_autobus_average_distance,
//                     count: value.fermate_autobus_count
//                 }, preferences.proximity_fermate_autobus, preferences.quantity_fermate_autobus, radius) +
//                 calculateScore({
//                     average_distance: value.palestre_average_distance,
//                     count: value.palestre_count
//                 }, preferences.proximity_palestre, preferences.quantity_palestre, radius) +
//                 calculateScore({
//                     average_distance: value.parcheggi_average_distance,
//                     count: value.parcheggi_count
//                 }, preferences.proximity_parcheggi, preferences.quantity_parcheggi, radius) +
//                 calculateScore({
//                     average_distance: value.parchi_e_giardini_average_distance,
//                     count: value.parchi_e_giardini_count
//                 }, preferences.proximity_parchi_e_giardini, preferences.quantity_parchi_e_giardini, radius) +
//                 calculateScore({
//                     average_distance: value.scuole_average_distance,
//                     count: value.scuole_count
//                 }, preferences.proximity_scuole, preferences.quantity_scuole, radius) +
//                 calculateScore({
//                     average_distance: value.strutture_sanitarie_average_distance,
//                     count: value.strutture_sanitarie_count
//                 }, preferences.proximity_strutture_sanitarie, preferences.quantity_strutture_sanitarie, radius) +
//                 calculateScore({
//                     average_distance: value.supermercati_average_distance,
//                     count: value.supermercati_count
//                 }, preferences.proximity_supermercati, preferences.quantity_supermercati, radius);
//
//
//             // ranks.push({
//             //     score: totalScore,
//             //     immobile: civ_key
//             // });
//             ranks.set(civ_key, totalScore);
//         });
//
//         console.log(ranks);
//         return ranks;
//     } catch (e) {
//         console.log(e)
//     }
//     return new Map();
// };
//
// const calculateScore = (
//     poiData: { average_distance: number, count: number },
//     proximityWeight: number,
//     quantityWeight: number,
//     radius: number = RADIUS_METERS
// ): number => {
//     // Normalizzare la distanza (più è vicina, più è positivo)
//     const normalizedDistance = poiData.average_distance === null ? 0 : 1 - Math.min(poiData.average_distance / radius, 1);
//
//
//     // Normalizzare la quantità (ad esempio, usando una funzione logaritmica per evitare l'effetto saturazione)
//     const normalizedQuantity = poiData.count > 1 ? Math.log(poiData.count + 1) / Math.log(radius) : 0;
//
//     // Punteggio ponderato
//     const proximityScore = proximityWeight * normalizedDistance;
//     const quantityScore = quantityWeight * normalizedQuantity;
//
//     return proximityScore + quantityScore;
// };
//
//
// const getPOIData = async (db: PostgresJsDatabase<typeof schema>,
//                           immobili_list: InferSelectModel<typeof schema.immobili>[],
//                           tableName: string,
//                           radius: number = RADIUS_METERS
// ): Promise<Map<string, any>> => {
//     const civ_keys = immobili_list.map(i => i.civ_key);
//     const query = db.select({
//         'civ_key': schema.immobili.civ_key,
//         'count': count(),
//         'average_distance': avg(sql.raw(`ST_Distance
//             (ST_Transform(immobili.geo_point, 32611), ST_Transform(${tableName + '.geo_point'},32611))`))
//     })
//         .from(schema.immobili)
//         .leftJoin(sql.raw(`${tableName}`),
//             sql.raw(`ST_DWithin
//             (ST_Transform(immobili.geo_point, 32611), ST_Transform(${tableName + '.geo_point'},32611), ${radius})`))
//         .where(inArray(schema.immobili.civ_key, civ_keys))
//         .groupBy(schema.immobili.civ_key);
//
//     const results = await query.execute();
//     const dict = new Map<string, any>();
//     for (const {civ_key, count, average_distance} of results) {
//         dict.set(civ_key, {[`${tableName}_count`]: count, [`${tableName}_average_distance`]: average_distance});
//     }
//     return dict;
// };

