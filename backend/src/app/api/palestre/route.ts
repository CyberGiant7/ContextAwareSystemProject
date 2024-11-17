import {NextRequest, NextResponse} from 'next/server';
import {palestre as palestre_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {ApiError} from "next/dist/server/api-utils";

export const dynamic = "force-dynamic";

/**
 * @swagger
 *  /api/palestre:
 *     get:
 *       summary: Returns a list of gyms in the city of Bologna
 *       parameters:
 *         - in: query
 *           name: codice
 *           description: The code of the gym
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Point of Interest
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Gym not found
 */

/**
 * Handles GET requests to fetch a list of gyms.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response containing the list of gyms or an error message.
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');

    try {
        return NextResponse.json(await fetchData(palestre_schema, 'codice', codice));
    } catch (error) {
        if (error instanceof ApiError)
            return NextResponse.json({error: error.message}, {status: error.statusCode});
    }
}