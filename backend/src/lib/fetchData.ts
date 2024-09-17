// backend/src/app/api/utils/fetchData.ts
import {NextResponse} from 'next/server';
import {db} from "@/../db";
import {eq, sql, getTableColumns} from "drizzle-orm";
import {ApiError} from "next/dist/server/api-utils";

export async function fetchData(schema: any, searchParamKey?: string, searchParamValue?: string) {
    let query
    if (Object.hasOwn(schema, 'geo_point')) {
        query = db.select({
            ...getTableColumns(schema),
            "geo_point": sql`ST_AsGeoJSON(${schema.geo_point})`,
        }).from(schema);
    } else {
        query = db.select(getTableColumns(schema)).from(schema);
    }

    if (searchParamValue && searchParamKey) {
        query.where(sql`${schema[searchParamKey]} = ${searchParamValue}`);
    }

    const results = await query;
    if (results.length === 0 && searchParamValue) {
        throw new ApiError(404, `${searchParamKey} not found`);
    }

    // if result has geo_point, parse it
    if (results[0].geo_point) {
        results.forEach(item => {
            item.geo_point = JSON.parse(item.geo_point as string)
        });
    }

    return results;
}