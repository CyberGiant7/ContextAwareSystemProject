import {NextRequest, NextResponse} from 'next/server';
import {supermercati as supermercati_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {ApiError} from "next/dist/server/api-utils";

export const dynamic = "force-dynamic";

/**
 * @swagger
 *  /api/supermercati:
 *     get:
 *       summary: Returns a list of supermarkets of the city of Bologna
 *       parameters:
 *         - in: query
 *           name: codice
 *           description: The code of the supermarket
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Point of Interest
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Supermarket not found
 */

/**
 * Handles GET requests to fetch a list of supermarkets.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object containing the list of supermarkets or an error message.
 */
export async function GET(request: NextRequest){
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');

    try {
        return NextResponse.json(await fetchData(supermercati_schema, 'codice', codice));
    } catch (error) {
        if (error instanceof ApiError)
            return NextResponse.json({error: error.message}, {status: error.statusCode});
    }
}