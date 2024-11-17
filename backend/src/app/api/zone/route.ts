import {NextRequest, NextResponse} from 'next/server'
import * as schema from "../../../../db/schema";
import {zone_urbanistiche} from "../../../../db/schema";
import {db} from "@/../db";
import {eq, InferSelectModel} from "drizzle-orm";
import {fetchData} from "@/lib/fetchData";
import {ApiError} from "next/dist/server/api-utils";
import {rankZone} from "@/lib/rankZone";

export const dynamic = "force-dynamic"


/**
 * @swagger
 * /api/zone:
 *   get:
 *     summary: Retrieve zone urbanistiche data
 *     description: Fetches zone urbanistiche data based on search parameters. If 'order' is set to 'rank', results are ranked based on user preferences.
 *     parameters:
 *       - in: query
 *         name: zona_di_prossimita
 *         schema:
 *           type: string
 *         description: The proximity zone to filter results by.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [rank]
 *         description: Order results by rank if set to 'rank'.
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: The email to fetch user preferences for ranking.
 *     tags:
 *       - Zone Urbanistiche
 *     responses:
 *       200:
 *         description: A list of zone urbanistiche.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ZoneUrbanistiche'
 *       400:
 *         description: Bad request, email is required when order is set to 'rank'.
 *       404:
 *         description: Zone not found.
 *       500:
 *         description: Internal server error.
 */
export async function GET(request: NextRequest) {
    // Extract search parameters from the request URL
    const searchParams = request.nextUrl.searchParams;
    // Get the 'zona_di_prossimita' parameter from the search parameters
    const zona_di_prossimita = searchParams.get('zona_di_prossimita');
    // Check if the 'order' parameter is set to 'rank'
    const orderByRank = searchParams.get('order') === 'rank';
    // Get the 'email' parameter from the search parameters
    const email = searchParams.get('email');

    // Fetch zone urbanistiche based on 'zona_di_prossimita' if provided, otherwise fetch all
    let results = zona_di_prossimita
        ? await db.select().from(zone_urbanistiche).where(eq(zone_urbanistiche.zona_di_prossimita, zona_di_prossimita))
        : await db.select().from(zone_urbanistiche);

    // Return a 404 response if 'zona_di_prossimita' is provided but no results are found
    if (zona_di_prossimita && results.length === 0) {
        return NextResponse.json({error: 'Zone not found'}, {status: 404});
    }

    // If 'order' is set to 'rank', rank the results based on user preferences
    if (orderByRank) {
        // Return a 400 response if 'email' is not provided
        if (!email) {
            return NextResponse.json({error: 'email is required'}, {status: 400});
        }

        try {
            // Fetch user preferences based on the provided email
            const preferences = await fetchData(schema.user_preferences, 'email', email) as InferSelectModel<typeof schema.user_preferences>[];
            // Rank the results based on user preferences
            const rankedResults = await rankZone(db, results, preferences[0]);
            // Return the ranked results
            return NextResponse.json(rankedResults);
        } catch (error) {
            // Handle any API errors that occur during the fetch
            if (error instanceof ApiError) {
                return NextResponse.json({error: error.message}, {status: error.statusCode});
            }
        }
    }

    // Return the fetched results
    return NextResponse.json(results);
}