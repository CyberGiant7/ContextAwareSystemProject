import * as schema from '../../db/schema';
import {InferInsertModel, isNotNull, sql} from "drizzle-orm";
import {PostgresJsDatabase} from "drizzle-orm/postgres-js";

interface indirizzi {
    civ_key?: string
    indirizzo?: string
    quartiere?: string | null
    zona_di_prossimita?: string | null
    geo_point?: string
}

interface prezzi_agenzia_entrate {
    geo_shape?: string,
    codice?: string,
    prezzo_min?: number | null,
    prezzo_max?: number | null
}

interface InformazioniImmobile extends indirizzi, prezzi_agenzia_entrate {
    ascensore: boolean;
    piano: number;
    superficie: number;
    stato_immobile: string;
    classe_energetica: string;
    eta_costruzione: number;
    stato_finiture_esterne: string;
}

/**
 * Generates random information for a real estate property.
 *
 * @returns {InformazioniImmobile} - The generated information for the real estate property.
 */
function generateInformazioniImmobile(): InformazioniImmobile {
    return ({
        ascensore: Math.random() > 0.5,
        piano: Math.floor(Math.random() * 10),
        superficie: Math.floor(Math.random() * 322) + 28, // 28 - 350 mq
        stato_immobile: ['Da ristrutturare', 'Buono stato', 'Ristrutturato', 'Finemente ristrutturato'][Math.floor(Math.random() * 4)],
        classe_energetica: ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'][Math.floor(Math.random() * 8)],
        eta_costruzione: Math.floor(Math.random() * 124) + 1900,
        stato_finiture_esterne: ['Scadente', 'Normale', 'Ottimo'][Math.floor(Math.random() * 3)],
    })
}


/**
 * Generates the price for a real estate entry based on various factors.
 *
 * @param {any} info - The information about the real estate entry.
 * @returns {Promise<number>} - The generated price rounded to the nearest thousand.
 * @throws {Error} - Throws an error if the minimum or maximum price per square meter is not found.
 */
async function generatePrezzo(info: InformazioniImmobile): Promise<number> {
    // Throw an error if the minimum or maximum price per square meter is not found
    if (!info.prezzo_min || !info.prezzo_max) throw new Error('Prezzo per mq zona non trovato');

    // Generate a random price per square meter between the minimum and maximum values
    const prezzoPerMq = Math.floor(Math.random() * (info.prezzo_max - info.prezzo_min)) + info.prezzo_min;

    // Calculate the base price by multiplying the price per square meter by the surface area
    const prezzoBase = prezzoPerMq * info.superficie;

    // Define lists for construction age categories and corresponding merit coefficients
    const etaCostruzioneList = ["1 – 20 anni", "20 – 40 anni", "Oltre 40 anni"];
    const etaEStato = [[-5, 0, 0], [-10, 0, 5], [-15, 0, 10]];

    // Calculate the number of years since construction
    const nAnni = new Date().getFullYear() - info.eta_costruzione;

    // Determine the construction age category based on the number of years since construction
    const etaCostruzione = nAnni < 20 ? etaCostruzioneList[0] : nAnni < 40 ? etaCostruzioneList[1] : etaCostruzioneList[2];

    // Get the index of the construction age category and the index of the external finish state
    const etaIndex = etaCostruzioneList.indexOf(etaCostruzione);
    const statoIndex = ['Scadente', 'Normale', 'Ottimo'].indexOf(info.stato_finiture_esterne);

    // Initialize the merit coefficient based on the construction age and external finish state
    let coefficienteDiMerito = etaEStato[etaIndex][statoIndex];

    // Adjust the merit coefficient based on the presence of an elevator and the floor level
    const pianoCoefficients = info.ascensore ? [0, 0, -3, 0, 5] : [-10, -10, -15, -20, -30];
    coefficienteDiMerito += pianoCoefficients[Math.min(info.piano, 4)];

    // Define dictionaries for the state of the property and energy class merit coefficients
    const statoImmobileDict: Record<string, number> = {
        'Da ristrutturare': -10,
        'Buono stato': 0,
        'Ristrutturato': 5,
        'Finemente ristrutturato': 10
    };
    const classeEnergeticaDict: Record<string, number> = {
        'A+': 10,
        'A': 5,
        'B': 0,
        'C': 0,
        'D': -5,
        'E': -5,
        'F': -10,
        'G': -10
    };

    // Adjust the merit coefficient based on the state of the property and energy class
    coefficienteDiMerito += statoImmobileDict[info.stato_immobile] + classeEnergeticaDict[info.classe_energetica];

    // Calculate the final price by adjusting the base price with the merit coefficient
    let prezzo = prezzoBase + prezzoBase * (coefficienteDiMerito / 100);

    // Round the final price to the nearest thousand
    return Math.floor(prezzo / 1000) * 1000;
}


/**
 * Generates a specified number of real estate entries and inserts them into the database.
 *
 * @param {number} nImmobili - The number of real estate entries to generate.
 * @param {PostgresJsDatabase<any>} db - The database connection.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const GenerateImmobili = async (nImmobili: number, db: PostgresJsDatabase<any>): Promise<void> => {
    // Select addresses and prices from the database, ensuring the price is not null, and order randomly
    const indirizziPrezzi = await db.select()
        .from(schema.indirizzi)
        .innerJoin(schema.prezzi_agenzia_entrate, sql`ST_WITHIN
            (${schema.indirizzi.geo_point}, ${schema.prezzi_agenzia_entrate.geo_shape})`)
        .where(isNotNull(schema.prezzi_agenzia_entrate.prezzo_min))
        .orderBy(sql.raw("RANDOM()"))
        .limit(nImmobili).execute();

    // Initialize an array to hold the real estate entries
    const immobili: InferInsertModel<typeof schema.immobili>[] = [];

    // Loop through the number of real estate entries to generate
    for (let i = 0; i < nImmobili; i++) {
        // Generate information for the real estate entry and merge with address and price data
        const info = {...generateInformazioniImmobile(), ...indirizziPrezzi[i].indirizzi, ...indirizziPrezzi[i].prezzi_agenzia_entrate};
        try {
            // Generate the price for the real estate entry
            const prezzo = await generatePrezzo(info);
            // Add the real estate entry to the array
            immobili.push({...info, prezzo, civ_key: indirizziPrezzi[i].indirizzi.civ_key});
        } catch (e) {
            // Log any errors that occur during price generation
            console.log(e);
        }
    }

    // Insert the generated real estate entries into the database, ignoring conflicts
    await db.insert(schema.immobili).values(immobili).onConflictDoNothing().execute();

    return Promise.resolve();
};