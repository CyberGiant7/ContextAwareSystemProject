import {NextRequest, NextResponse} from 'next/server'
import {zone_urbanistiche} from "../../../../db/schema";
import {db} from "@/../db";
import {eq} from "drizzle-orm";

export const dynamic = "force-dynamic"

// GET /api/zone
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const zona_di_prossimita = searchParams.get('zona_di_prossimita')

    if (zona_di_prossimita) {
        const zone = await db.select().from(zone_urbanistiche).where(eq(zone_urbanistiche.zona_di_prossimita,zona_di_prossimita));
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