import {NextRequest, NextResponse} from 'next/server';
import {parcheggi as parcheggi_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {ApiError} from "next/dist/server/api-utils";

export const dynamic = "force-dynamic";


/**
 * @swagger
 *  /api/parcheggi:
 *     get:
 *       summary: Returns a list of all the parking lots in the city of Bologna
 *       parameters:
 *         - in: query
 *           name: codice
 *           description: The code of the parking lot
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Point of Interest
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Parking lot not found
 */

/**
 * Handles GET requests to fetch a list of parking lots.
 * @param request - The incoming request object.
 * @return - The response containing the list of parking lots or an error message.
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');

    try {
        return NextResponse.json(await fetchData(parcheggi_schema, 'codice', codice));
    } catch (error) {
        if (error instanceof ApiError)
            return NextResponse.json({error: error.message}, {status: error.statusCode});
    }
}