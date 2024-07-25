import {drizzle, PostgresJsDatabase} from 'drizzle-orm/postgres-js';
import {geomFromGeoJSON} from "drizzle-postgis/functions";
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';
import fs from 'fs';
import csvParser from "csv-parser";
import {TableConfig} from "drizzle-orm";
import {PgTable} from "drizzle-orm/pg-core";


dotenv.config({path: "./.env"});

const strToGeojsonPoint = (geoPoint: string) => {
    const geopoints = geoPoint.split(",").map(Number).reverse();
    return geomFromGeoJSON({"type": "Point", "coordinates": geopoints});
}

const importData = async (db: PostgresJsDatabase<any>, filePath: string, tableName: PgTable<TableConfig>, transformRow: (row: any) => any) => {
    const results: any[] = [];
    let stream = fs.createReadStream(filePath)
        .pipe(csvParser({separator: ';'}))
        .on('data', (data) => results.push(transformRow(data)))
    await new Promise<void>((resolve, reject) => {
        stream.on('end', async () => {
            try {
                await db.insert(tableName).values(results).onConflictDoNothing().execute();
            } catch (e) {
                console.log(e);
            } finally {
                resolve()
            }
        });
    });
}

const main = async () => {
        console.log(process.env.DATABASE_URL);
        const client = postgres(process.env.DATABASE_URL || '');
        const db = drizzle(client, {schema});

        // console.log(db);

        console.log("Seed start");
        await importData(db, './data/zone_urbanistiche.csv', schema.zone_urbanistiche, (row) => ({
            ...row,
            geo_point: strToGeojsonPoint(row.geo_point),
            geo_shape: geomFromGeoJSON(JSON.parse(row.geo_shape)),
        }));
        await importData(db, './data/teatri_cinema.csv', schema.teatri_cinema, (row) => ({
            ...row,
            zona_di_prossimita: row.zona_di_prossimita?.toUpperCase(),
            geo_point: geomFromGeoJSON(JSON.parse(row.geo_point)),
        }));
        await importData(db, './data/bar_ristoranti.csv', schema.bar_ristoranti, (row) => ({
            ...row,
            geo_point: geomFromGeoJSON(JSON.parse(row.geo_point)),
        }));

        await importData(db, './data/biblioteche.csv', schema.biblioteche, (row) => ({
            ...row,
            geo_point: strToGeojsonPoint(row.geo_point),
            superficie_totale_mq: parseInt(row.superficie_totale_mq),
            superficie_accessibile_al_pubblico: parseInt(row.superficie_accessibile_al_pubblico),
            numero_postazioni_lettura: row.numero_postazioni_lettura ? parseInt(row.numero_postazioni_lettura) : null
        }));

        await importData(db, './data/farmacie.csv', schema.farmacie, (row) => ({
            ...row,
            geo_point: strToGeojsonPoint(row.geo_point),
        }));

        await importData(db, "./data/palestre.csv", schema.palestre, (row) => {
            if (!row.zona_di_prossimita) {
                delete row.zona_di_prossimita;
            }
            return {
                ...row,
                geo_point: geomFromGeoJSON(JSON.parse(row.geo_point)),
            };
        });
        await importData(db, "./data/parcheggi.csv", schema.parcheggi, (row) => (
            {
                ...row,
                geo_point: strToGeojsonPoint(row.geo_point),
                numero_posti: parseInt(row.numero_posti)
            }
        ));
        // giardini e parchi
        await importData(db, "./data/parchi_e_giardini.csv", schema.parchi_e_giardini, (row) => (
            {
                ...row,
                geo_point: geomFromGeoJSON(JSON.parse(row.geo_point)),
            }
        ));

        await importData(db, "./data/scuole.csv", schema.scuole, (row) => (
            {
                ...row,
                geo_point: geomFromGeoJSON(JSON.parse(row.geo_point)),
            }
        ));

        // strutture_sanitarie
        await importData(db, "./data/strutture_sanitarie.csv", schema.strutture_sanitarie, (row) => (
            {
                ...row,
                geo_point: strToGeojsonPoint(row.geo_point),
                titolarita: row.titolarita || null
            }
        ));

        //supermercati
        await importData(db, "./data/supermercati.csv", schema.supermercati, (row) => {
            if (!row.zona_di_prossimita) {
                delete row.zona_di_prossimita;
            }
            return {
                ...row,
                geo_point: geomFromGeoJSON(JSON.parse(row.geo_point)),
            }
        });

        //fermate autobus
        await importData(db, "./data/tper_fermate_autobus.csv", schema.fermate_autobus, (row) => (
            {
                ...row,
                geo_point: strToGeojsonPoint(row.geo_point),
                numero_linee: parseInt(row.numero_linee)
            }
        ));

        console.log("Seed done");

        try {
            await client.end();
            console.log("Connection closed");
        } catch (e) {
            // console.log(e);
        }
        return;
    }
;

main();