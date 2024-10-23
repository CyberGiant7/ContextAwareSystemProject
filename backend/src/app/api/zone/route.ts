import {NextRequest, NextResponse} from 'next/server'
import {zone_urbanistiche} from "../../../../db/schema";
import {db} from "@/../db";
import {eq, InferSelectModel} from "drizzle-orm";
import * as schema from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {ApiError} from "next/dist/server/api-utils";
import {rankImmobili} from "@/lib/rankImmobile";
import {rankZone} from "@/lib/rankZone";

export const dynamic = "force-dynamic"


/**
 * @swagger
 *  /api/zone:
 *     get:
 *       description: Returns a list of zone urbanistiche of the city of Bologna
 *       parameters:
 *         - in: query
 *           name: zona_di_prossimita
 *           description: The name of zona di prossimita
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Zone
 *       responses:
 *         200:
 *           description: A list of zone urbanistiche
 *         404:
 *           description: Zone not found
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const zona_di_prossimita = searchParams.get('zona_di_prossimita')
    const orderByRank = searchParams.get('order') === 'rank';
    const email = searchParams.get('email');


    let results: any[] = [];
    if (zona_di_prossimita) {
        results = await db.select().from(zone_urbanistiche).where(eq(zone_urbanistiche.zona_di_prossimita, zona_di_prossimita));
        if (results.length === 0) {
            return NextResponse.json({error: 'Zone not found'}, {status: 404});
        }
    } else {
        results = await db.select().from(zone_urbanistiche);
    }

    // If orderByRank is true, process ranking and preferences
    if (orderByRank) {
        if (!email) {
            return NextResponse.json({error: 'email is required'}, {status: 400});
        }
        let preferences: InferSelectModel<typeof schema.user_preferences>[] = [];
        try {
            preferences = await fetchData(schema.user_preferences, 'email', email) as InferSelectModel<typeof schema.user_preferences>[];
        } catch (error) {
            if (error instanceof ApiError) {
                return NextResponse.json({error: error.message}, {status: error.statusCode});
            }
        }
        const rankedResults = await rankZone(db, results, preferences[0]);
        return NextResponse.json(rankedResults);
    }

    return NextResponse.json(results);
}