import {NextRequest, NextResponse} from "next/server";
import {InferSelectModel} from "drizzle-orm";
import * as schema from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {ApiError} from "next/dist/server/api-utils";
import {rankPoints} from "@/lib/rankPoint";
import {db} from "../../../../db";

/**
 * @swagger
 * /api/equidistant_points:
 *   get:
 *     summary: Retrieve ranked equidistant points based on user preferences
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The email of the user to fetch preferences for
 *       - in: query
 *         name: radius
 *         schema:
 *           type: integer
 *           default: 500
 *         required: false
 *         description: The radius within which to search for points
 *     tags:
 *         - Equidistant Points
 *     responses:
 *       200:
 *         description: A list of ranked equidistant points
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Bad request, email is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
/**
 * Handles GET requests to retrieve ranked equidistant points based on user preferences.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response containing ranked equidistant points or an error message.
 */
export async function GET(request: NextRequest) {
    // Extract search parameters from the request URL
    const {searchParams} = request.nextUrl;
    const email = searchParams.get('email');
    const radius = searchParams.get('radius') || 500;

    // Check if the email parameter is provided
    if (!email) {
        return NextResponse.json({error: 'email is required'}, {status: 400});
    }

    let preferences: InferSelectModel<typeof schema.user_preferences>[] = [];
    let points: InferSelectModel<typeof schema.equidistant_points>[] = [];
    try {
        // Fetch user preferences and equidistant points from the database
        preferences = await fetchData(schema.user_preferences, 'email', email) as InferSelectModel<typeof schema.user_preferences>[];
        points = await fetchData(schema.equidistant_points) as InferSelectModel<typeof schema.equidistant_points>[];
    } catch (error) {
        // Handle API errors
        if (error instanceof ApiError) {
            return NextResponse.json({error: error.message}, {status: error.statusCode});
        }
    }

    // Rank the equidistant points based on user preferences and radius
    const rankedResults = await rankPoints(db, points, preferences[0], radius ? Number(radius) : undefined);
    return NextResponse.json(rankedResults);
}