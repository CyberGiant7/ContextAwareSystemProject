import {NextRequest, NextResponse} from 'next/server'
import {zone_urbanistiche} from "../../../../db/schema";
import {db} from "@/../db";
import {eq, sql} from "drizzle-orm";



export const dynamic = "force-dynamic"

// GET /api/zone
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const zona_di_prossimita = searchParams.get('zona_di_prossimita')

    if (zona_di_prossimita) {
        const zone = await db.select({
            zona_di_prossimita: zone_urbanistiche.zona_di_prossimita,
            nome_quartiere: zone_urbanistiche.nome_quartiere,
            codice_quartiere: zone_urbanistiche.codice_quartiere,
            geo_point: zone_urbanistiche.geo_point,
            geo_shape: sql`ST_AsGeoJSON(${zone_urbanistiche.geo_shape})`,
            }
        ).from(zone_urbanistiche).where(eq(zone_urbanistiche.zona_di_prossimita,zona_di_prossimita));
        if (zone.length === 0) {
            // error
            return NextResponse.json({error: 'Zone not found'}, {status: 404});
        }
        return NextResponse.json(zone);
    }
    const zone = await db.select().from(zone_urbanistiche)
    console.log(zone)

    return NextResponse.json(zone);
}