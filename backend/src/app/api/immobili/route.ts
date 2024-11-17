import {NextRequest, NextResponse} from 'next/server'
import {immobili as immobili_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {rankImmobili, rankImmobili2, RankedImmobile} from "@/lib/rankImmobile";
import {db} from "../../../../db";
import {eq, InferSelectModel} from "drizzle-orm";
import * as schema from "../../../../db/schema";
import {ApiError} from "next/dist/server/api-utils";


export const dynamic = "force-dynamic"



/**
 * @swagger
 * /api/immobili:
 *   get:
 *     summary: Retrieve immobili data based on search parameters
 *     parameters:
 *       - in: query
 *         name: civ_key
 *         schema:
 *           type: string
 *         description: The civ_key to filter immobili
 *       - in: query
 *         name: zona
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: The zones to filter immobili
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Order results by rank if 'rank' is provided
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: The email to fetch user preferences for ranking
 *       - in: query
 *         name: radius
 *         schema:
 *           type: string
 *         description: The radius to consider for ranking
 *       - in: query
 *         name: rank_mode
 *         schema:
 *           type: string
 *         description: The mode to use for ranking (e.g., '2' for rankImmobili2)
 *     tags:
 *       - Immobili
 *     responses:
 *       200:
 *         description: A list of immobili
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Bad request, email is required for ranking
 *       500:
 *         description: Internal server error
 */
export async function GET(request: NextRequest) {
    // Extract search parameters from the request URL
    const { searchParams } = request.nextUrl;
    const civKey = searchParams.get('civ_key');
    const zones = searchParams.getAll('zona');
    const orderByRank = searchParams.get('order') === 'rank';
    const email = searchParams.get('email');
    const radius = searchParams.get('radius');
    const rankMode = searchParams.get('rank_mode');

    let results: any[] = [];

    // Fetch data based on the provided zones
    if (zones.length > 0) {
        for (const z of zones) {
            results = results.concat(await fetchData(immobili_schema, 'zona_di_prossimita', z));
        }
    // Fetch data based on the provided civ_key
    } else if (civKey) {
        results = await fetchData(immobili_schema, 'civ_key', civKey);
    // Fetch all data if no specific parameters are provided
    } else {
        results = await fetchData(immobili_schema);
    }

    // If order by rank is requested
    if (orderByRank) {
        // Ensure email is provided
        if (!email) {
            return NextResponse.json({ error: 'email is required' }, { status: 400 });
        }

        let preferences: InferSelectModel<typeof schema.user_preferences>[] = [];
        try {
            // Fetch user preferences based on the provided email
            preferences = await fetchData(schema.user_preferences, 'email', email) as InferSelectModel<typeof schema.user_preferences>[];
        } catch (error) {
            if (error instanceof ApiError) {
                return NextResponse.json({ error: error.message }, { status: error.statusCode });
            }
        }

        // Determine the ranking function to use based on rank_mode
        const rankFunction = rankMode === '2' ? rankImmobili2 : rankImmobili;
        // Rank the results based on user preferences and optional radius
        const rankedResults = await rankFunction(db, results, preferences[0], radius ? Number(radius) : undefined);
        return NextResponse.json(rankedResults);
    }

    // Return the fetched results
    return NextResponse.json(results);
}