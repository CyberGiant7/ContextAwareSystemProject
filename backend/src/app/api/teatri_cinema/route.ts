import {NextRequest, NextResponse} from 'next/server';
import {teatri_cinema as teatri_cinema_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {ApiError} from "next/dist/server/api-utils";

export const dynamic = "force-dynamic";

/**
 * @swagger
 *  /api/teatri_cinema:
 *     get:
 *       summary: Returns a list of theaters and cinemas of the city of Bologna
 *       parameters:
 *         - in: query
 *           name: civ_key
 *           description: The code of the theater or cinema
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Point of Interest
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Theater or cinema not found
 */

/**
 * Handles GET requests to fetch a list of theaters and cinemas.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response containing the list of theaters and cinemas or an error message.
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const civ_key = searchParams.get('civ_key');
    try {
        return NextResponse.json(await fetchData(teatri_cinema_schema, 'civ_key', civ_key));
    } catch (error) {
        if (error instanceof ApiError)
            return NextResponse.json({error: error.message}, {status: error.statusCode});
    }
}