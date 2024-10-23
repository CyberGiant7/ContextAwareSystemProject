import {NextRequest, NextResponse} from 'next/server'
import {immobili as immobili_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {rankImmobili} from "@/lib/rankImmobile";
import {db} from "../../../../db";
import {eq, InferSelectModel} from "drizzle-orm";
import * as schema from "../../../../db/schema";
import {ApiError} from "next/dist/server/api-utils";


export const dynamic = "force-dynamic"

/**
 * @swagger
 *  /api/immobili:
 *     get:
 *       description: Returns a list of real estate in the city of Bologna
 *       parameters:
 *         - in: query
 *           name: civ_key
 *           description: The code of the of real estate
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Immobili
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Real estate not found
 */

export async function GET(request: NextRequest) {
    const {searchParams} = request.nextUrl;
    const civKey = searchParams.get('civ_key');
    const zones = searchParams.getAll('zona');
    const orderByRank = searchParams.get('order') === 'rank';
    const email = searchParams.get('email');
    const radius = searchParams.get('radius');


    let results: any[] = [];

    // Fetch results based on zones or civKey
    if (zones.length > 0) {
        for (const z of zones) {
            results = results.concat(await fetchData(immobili_schema, 'zona_di_prossimita', z));
        }
    } else if (civKey) {
        results = await fetchData(immobili_schema, 'civ_key', civKey);
    } else {
        results = await fetchData(immobili_schema);
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

        const rankedResults = await rankImmobili(db, results, preferences[0], radius ? Number(radius) : undefined);
        return NextResponse.json(rankedResults);
    }

    return NextResponse.json(results);
}
