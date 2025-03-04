import {drizzle, PostgresJsDatabase} from 'drizzle-orm/postgres-js';
import {geomFromGeoJSON} from "drizzle-postgis/functions";
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';
import fs from 'fs';
import csvParser from "csv-parser";
import {TableConfig} from "drizzle-orm";
import {PgTable} from "drizzle-orm/pg-core";
import {GenerateImmobili} from "@/lib/GenerateImmobili";
import {strToGeometryPoint} from "@/lib/utils";
import {seedDistancesTable} from "@/lib/seedDistancesTable";


dotenv.config({path: "./.env"});


/**
 * Asynchronously imports data from a CSV file into a specified database table.
 *
 * Reads data from the provided CSV file, transforms each row using the given
 * transform function, and inserts the transformed data into the specified table
 * in the database. The insertion is done in chunks to handle large datasets efficiently.
 * If any conflict arises during insertion, it is ignored.
 *
 * @param db - The database connection instance.
 * @param filePath - The path to the CSV file containing the data to be imported.
 * @param tableName - The database table into which the data should be inserted.
 * @param transformRow - A function to transform each row of data before insertion.
 */
const importData = async (db: PostgresJsDatabase<any>,
                          filePath: string, tableName: PgTable<TableConfig>,
                          transformRow: (row: any) => any) => {
    const results: any[] = [];
    let stream = fs.createReadStream(filePath)
        .pipe(csvParser({separator: ';'}))
        .on('data', (data) => results.push(transformRow(data)))
    await new Promise<void>((resolve, reject) => {
        stream.on('end', async () => {
            try {
                if (results.length > 1000) {
                    const chunkSize = 1000;
                    for (let i = 0; i < results.length; i += chunkSize) {
                        const chunk = results.slice(i, i + chunkSize);
                        await db.insert(tableName).values(chunk).onConflictDoNothing().execute();
                    }
                } else {
                    await db.insert(tableName).values(results).onConflictDoNothing().execute();
                }
            } catch (e) {
                console.log(e);
            } finally {
                resolve()
            }
        });
    });
}

/**
 * Main function to seed the database with data from CSV files.
 *
 * Establishes a connection to the database and imports data from various CSV files into corresponding tables.
 * Transforms the data as needed before insertion. Additionally, it generates immobili data if the existing
 * records are below a certain threshold and seeds the distances table with computed distances.
 *
 * The function performs the following steps:
 * 1. Connects to the PostgreSQL database.
 * 2. Defines a series of import tasks specifying CSV files, destination tables, and transformation functions.
 * 3. Iterates over each import task, reading data from the CSV file and inserting it into the database.
 * 4. Generates immobili data if the current entries are less than 500.
 * 5. Seeds the distances table with calculated distances between immobili and other entities.
 * 6. Closes the database connection.
 *
 * Logs the progress of each step to the console for monitoring.
 */
const main = async () => {
        const client = postgres(process.env.DATABASE_URL || '');

        const db = drizzle(client, {schema});


        const importTasks = [
            {
                file: './data/quartieri.csv',
                table: schema.quartieri,
                transform: (row: any) => ({
                    ...row,
                    geo_shape: geomFromGeoJSON(JSON.parse(row.geo_shape))
                })
            },
            {
                file: './data/zone_urbanistiche.csv',
                table: schema.zone_urbanistiche,
                transform: (row: any) => ({
                    ...row,
                    geo_point: strToGeometryPoint(row.geo_point),
                    geo_shape: geomFromGeoJSON(JSON.parse(row.geo_shape))
                })
            },
            {
                file: './data/indirizzi.csv',
                table: schema.indirizzi,
                transform: (row: any) => ({
                    ...row,
                    geo_point: strToGeometryPoint(row.geo_point),
                    zona_di_prossimita: row.zona_di_prossimita?.toUpperCase(),
                })
            },
            {
                file: './data/teatri_cinema.csv',
                table: schema.teatri_cinema,
                transform: (row: any) => ({
                    ...row,
                    zona_di_prossimita: row.zona_di_prossimita?.toUpperCase(),
                    geo_point: geomFromGeoJSON(JSON.parse(row.geo_point))
                })
            },
            {
                file: './data/bar_ristoranti.csv',
                table: schema.bar_ristoranti,
                transform: (row: any) => ({...row, geo_point: geomFromGeoJSON(JSON.parse(row.geo_point))})
            },
            {
                file: './data/biblioteche.csv',
                table: schema.biblioteche,
                transform: (row: any) => ({
                    ...row,
                    geo_point: geomFromGeoJSON(JSON.parse(row.geo_point)),
                })
            },
            {
                file: './data/farmacie.csv',
                table: schema.farmacie,
                transform: (row: any) => ({...row, geo_point: strToGeometryPoint(row.geo_point)})
            },
            {
                file: './data/palestre.csv',
                table: schema.palestre,
                transform: (row: any) => ({
                    ...row,
                    geo_point: geomFromGeoJSON(JSON.parse(row.geo_point)),
                    zona_di_prossimita: row.zona_di_prossimita || undefined
                })
            },
            {
                file: './data/parcheggi.csv',
                table: schema.parcheggi,
                transform: (row: any) => ({
                    ...row,
                    geo_point: strToGeometryPoint(row.geo_point),
                    numero_posti: parseInt(row.numero_posti)
                })
            },
            {
                file: './data/parchi_e_giardini.csv',
                table: schema.parchi_e_giardini,
                transform: (row: any) => ({...row, geo_point: geomFromGeoJSON(JSON.parse(row.geo_point))})
            },
            {
                file: './data/scuole.csv',
                table: schema.scuole,
                transform: (row: any) => ({...row, geo_point: geomFromGeoJSON(JSON.parse(row.geo_point))})
            },
            {
                file: './data/strutture_sanitarie.csv',
                table: schema.strutture_sanitarie,
                transform: (row: any) => ({
                    ...row,
                    geo_point: strToGeometryPoint(row.geo_point),
                    titolarita: row.titolarita || null
                })
            },
            {
                file: './data/supermercati.csv',
                table: schema.supermercati,
                transform: (row: any) => ({
                    ...row,
                    geo_point: geomFromGeoJSON(JSON.parse(row.geo_point))
                })
            },
            {
                file: './data/tper_fermate_autobus.csv',
                table: schema.fermate_autobus,
                transform: (row: any) => ({
                    ...row,
                    geo_point: strToGeometryPoint(row.geo_point),
                    numero_linee: parseInt(row.numero_linee)
                })
            },
            {
                file: './data/prezzi_agenzia_entrate.csv',
                table: schema.prezzi_agenzia_entrate,
                transform: (row: any) => ({
                    ...row,
                    geo_shape: geomFromGeoJSON(JSON.parse(row.geo_shape)),
                    prezzo_min: row.prezzo_min ? parseInt(row.prezzo_min) : null,
                    prezzo_max: row.prezzo_max ? parseInt(row.prezzo_max) : null
                })
            },
            {
                file: './data/equidistant_points.csv',
                table: schema.equidistant_points,
                transform: (row: any) => ({
                    ...row,
                    geo_point: geomFromGeoJSON(JSON.parse(row.geo_point))
                })
            }
        ];

        console.log("Seed start");

        for (const task of importTasks) {
            console.log("Importing:", task.file);
            await importData(db, task.file, task.table, task.transform);
        }
        console.log("Generating immobili");
        let immobili = await db.select().from(schema.immobili).execute();
        if (immobili.length < 500) {
            await GenerateImmobili(500, db)
        }

        console.log("Seeding distances");
        await seedDistancesTable(db)

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

/**
 * Executes the main function and handles the process exit.
 *
 * Ensures that the process exits with a status code of 0 on success,
 * or 1 on error, logging any errors encountered.
 */
main().then(() => {
    process.exit(0);
}).catch((e) => {
    console.log(e);
    process.exit(1);
});