
import {NextResponse} from 'next/server';
import {db} from "@/../db";
import {eq, sql, getTableColumns} from "drizzle-orm";
import {ApiError} from "next/dist/server/api-utils";

/**
 * Fetches data from the database based on the provided schema and optional search parameters.
 *
 * @param {any} schema - The schema of the table to query.
 * @param {string} [searchParamKey] - The key of the search parameter.
 * @param {string | null} [searchParamValue] - The value of the search parameter.
 * @returns {Promise<any[]>} - The query results.
 * @throws {ApiError} - Throws a 404 error if no results are found and a search parameter was provided.
 */
export async function fetchData(schema: any, searchParamKey?: string, searchParamValue?: string | null): Promise<any[]> {
    // Initialize the query variable
    let query;

    // Check if the schema has a 'geo_point' property
    if (Object.hasOwn(schema, 'geo_point')) {
        // If 'geo_point' exists, select all columns and convert 'geo_point' to GeoJSON
        query = db.select({
            ...getTableColumns(schema),
            "geo_point": sql`ST_AsGeoJSON(${schema.geo_point})`,
        }).from(schema);
    } else {
        // If 'geo_point' does not exist, select all columns
        query = db.select(getTableColumns(schema)).from(schema);
    }

    // If search parameters are provided, add a WHERE clause to the query
    if (searchParamValue && searchParamKey) {
        query.where(sql`${schema[searchParamKey]} = ${searchParamValue}`);
    }

    // Execute the query and store the results
    const results = await query;

    // If no results are found and a search parameter was provided, throw a 404 error
    if (results.length === 0 && searchParamValue) {
        throw new ApiError(404, `${searchParamKey} not found`);
    }

    // If the results contain 'geo_point', parse it from JSON
    if (results[0].geo_point) {
        results.forEach(item => {
            item.geo_point = JSON.parse(item.geo_point as string);
        });
    }

    // Return the query results
    return results;
}