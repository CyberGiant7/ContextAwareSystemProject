import * as schema from '../../db/schema';
import { sql, InferInsertModel, isNotNull } from "drizzle-orm";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

const generateInformazioniImmobile = () => ({
    ascensore: Math.random() > 0.5,
    piano: Math.floor(Math.random() * 10),
    superficie: Math.floor(Math.random() * 322) + 28, // 28 - 350 mq
    stato_immobile: ['Da ristrutturare', 'Buono stato', 'Ristrutturato', 'Finemente ristrutturato'][Math.floor(Math.random() * 4)],
    classe_energetica: ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'][Math.floor(Math.random() * 8)],
    eta_costruzione: Math.floor(Math.random() * 124) + 1900,
    stato_finiture_esterne: ['Scadente', 'Normale', 'Ottimo'][Math.floor(Math.random() * 3)],
});

const generatePrezzo = async (db: PostgresJsDatabase<any>, info: any) => {
    if (!info.prezzo_min || !info.prezzo_max) throw new Error('Prezzo per mq zona non trovato');

    // random price between min and max
    const prezzoPerMq = Math.floor(Math.random() * (info.prezzo_max - info.prezzo_min)) + info.prezzo_min;

    const prezzoBase = prezzoPerMq * info.superficie;
    const etaCostruzioneList = ["1 – 20 anni", "20 – 40 anni", "Oltre 40 anni"];
    const etaEStato = [[-5, 0, 0], [-10, 0, 5], [-15, 0, 10]];
    const nAnni = new Date().getFullYear() - info.eta_costruzione;
    const etaCostruzione = nAnni < 20 ? etaCostruzioneList[0] : nAnni < 40 ? etaCostruzioneList[1] : etaCostruzioneList[2];
    const etaIndex = etaCostruzioneList.indexOf(etaCostruzione);
    const statoIndex = ['Scadente', 'Normale', 'Ottimo'].indexOf(info.stato_finiture_esterne);

    let coefficienteDiMerito = etaEStato[etaIndex][statoIndex];
    const pianoCoefficients = info.ascensore ? [0, 0, -3, 0, 5] : [-10, -10, -15, -20, -30];
    coefficienteDiMerito += pianoCoefficients[Math.min(info.piano, 4)];

    const statoImmobileDict: Record<string, number>= { 'Da ristrutturare': -10, 'Buono stato': 0, 'Ristrutturato': 5, 'Finemente ristrutturato': 10 };
    const classeEnergeticaDict: Record<string, number> = { 'A+': 10, 'A': 5, 'B': 0, 'C': 0, 'D': -5, 'E': -5, 'F': -10, 'G': -10 };
    coefficienteDiMerito += statoImmobileDict[info.stato_immobile] + classeEnergeticaDict[info.classe_energetica];

    let prezzo = prezzoBase + prezzoBase * (coefficienteDiMerito / 100);
    return Math.floor(prezzo / 1000) * 1000;
};

export const GenerateImmobili = async (nImmobili: number, db: PostgresJsDatabase<any>) => {
    const indirizziPrezzi = await db.select()
        .from(schema.indirizzi)
        .innerJoin(schema.prezzi_agenzia_entrate, sql`ST_WITHIN(${schema.indirizzi.geo_point}, ${schema.prezzi_agenzia_entrate.geo_shape})`)
        .where(isNotNull(schema.prezzi_agenzia_entrate.prezzo_min))
        .orderBy(sql.raw("RANDOM()"))
        .limit(nImmobili).execute();

    const immobili: InferInsertModel<typeof schema.immobili>[] = [];

    for (let i = 0; i < nImmobili; i++) {
        const info = { ...generateInformazioniImmobile(), ...indirizziPrezzi[i].indirizzi, ...indirizziPrezzi[i].prezzi_agenzia_entrate };
        try {
            const prezzo = await generatePrezzo(db, info);
            immobili.push({ ...info, prezzo, civ_key: indirizziPrezzi[i].indirizzi.civ_key });
        } catch (e) {
            console.log(e);
        }
    }

    await db.insert(schema.immobili).values(immobili).onConflictDoNothing().execute();
};