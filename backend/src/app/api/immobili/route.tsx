import {NextRequest, NextResponse} from 'next/server'
import {immobili as immobili_schema} from "../../../../db/schema";
import {db} from "@/../db";
import {eq, sql, getTableColumns} from "drizzle-orm";


export const dynamic = "force-dynamic"

// GET /api/zone
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const civ_key = searchParams.get('civ_key')

    if (civ_key) {
        const immobile = await db
            .select({
                ...getTableColumns(immobili_schema),
                "geo_point": sql`ST_AsGeoJSON(${immobili_schema.geo_point})`,
            })
            .from(immobili_schema)
            .where(eq(immobili_schema.civ_key, civ_key));

        immobile[0].geo_point = JSON.parse(immobile[0].geo_point as string)
        if (immobile.length === 0) {
            // error
            return NextResponse.json({error: 'Zone not found'}, {status: 404});
        }
        return NextResponse.json(immobile);
    }
    const immobili = await db
        .select({
            ...getTableColumns(immobili_schema),
            "geo_point": sql`ST_AsGeoJSON(${immobili_schema.geo_point})`,
        })
        .from(immobili_schema)
    immobili.forEach((immobile) => { immobile.geo_point = JSON.parse(immobile.geo_point as string) })
    console.log(immobili)

    return NextResponse.json(immobili);
}