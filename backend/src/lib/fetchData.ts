// backend/src/app/api/utils/fetchData.ts
import {NextResponse} from 'next/server';
import {db} from "@/../db";
import {eq, sql, getTableColumns} from "drizzle-orm";

export async function fetchData(schema: any, searchParamKey: string, searchParamValue: string | null) {
    const query = db
        .select({
            ...getTableColumns(schema),
            "geo_point": sql`ST_AsGeoJSON(${schema.geo_point})`,
        })
        .from(schema);

    if (searchParamValue) {
        query.where(sql`${schema[searchParamKey]} = ${searchParamValue}`);
    }

    const results = await query;
    if (results.length === 0 && searchParamValue) {
        return NextResponse.json({ error: `${searchParamKey} not found` }, { status: 404 });
    }

    results.forEach(item => { item.geo_point = JSON.parse(item.geo_point as string) });
    return results;
}