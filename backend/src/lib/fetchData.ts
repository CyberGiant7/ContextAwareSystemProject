// backend/src/app/api/utils/fetchData.ts
import {NextRequest, NextResponse} from 'next/server';
import {db} from "@/../db";
import {eq, sql, getTableColumns} from "drizzle-orm";

export async function fetchData(schema: any, searchParamKey: string, searchParamValue: string | null) {
    if (searchParamValue) {
        const result = await db
            .select({
                ...getTableColumns(schema),
                "geo_point": sql`ST_AsGeoJSON(${schema.geo_point})`,
            })
            .from(schema)
            .where(eq(schema[searchParamKey], searchParamValue));

        result[0].geo_point = JSON.parse(result[0].geo_point as string);
        if (result.length === 0) {
            return NextResponse.json({error: `${searchParamKey} not found`}, {status: 404});
        }
        return NextResponse.json(result);
    }
    const results = await db
        .select({
            ...getTableColumns(schema),
            "geo_point": sql`ST_AsGeoJSON(${schema.geo_point})`,
        })
        .from(schema);
    results.forEach((item) => { item.geo_point = JSON.parse(item.geo_point as string) });
    return NextResponse.json(results);
}