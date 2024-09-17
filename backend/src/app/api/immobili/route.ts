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

    if (zones.length > 0) {
        // const results = zones.flatMap(zone => fetchData(immobili_schema, 'zona_di_prossimita', zone));
        let results: any[] = []
        for (const z of zones) {
            results = results.concat(await fetchData(immobili_schema, 'zona_di_prossimita', z))
        }

        if (orderByRank) {
            if (!email) {
                return NextResponse.json({error: 'email not found'}, {status: 404});
            }
            let preferences: InferSelectModel<typeof schema.user_preferences>[] = [];
            try {
                preferences = await fetchData(schema.user_preferences, 'email', email) as InferSelectModel<typeof schema.user_preferences>[];
                if (preferences.length === 0) {
                    return NextResponse.json({error: 'preferences not found'}, {status: 404});
                }
            } catch (error) {
                if (error instanceof ApiError)
                    return NextResponse.json({error: error.message}, {status: error.statusCode});
            }

            const rankedResult = await rankImmobili(db, results as InferSelectModel<typeof schema.immobili>[], preferences[0]);
            results.forEach(result => result.rank = rankedResult.get(result.civ_key));
            results.sort((a, b) => b.rank - a.rank);

            return NextResponse.json(results);
        }

        return NextResponse.json(results);
    }

    return NextResponse.json(await fetchData(immobili_schema, 'civ_key', civKey));
}
