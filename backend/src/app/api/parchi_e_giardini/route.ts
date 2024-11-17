import {NextRequest, NextResponse} from 'next/server';
import {parchi_e_giardini as parchi_e_giardini_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {ApiError} from "next/dist/server/api-utils";

export const dynamic = "force-dynamic";

/**
 * @swagger
 *  /api/parchi_e_giardini:
 *     get:
 *       summary: Returns a list of all the parks and gardens in the city of Bologna
 *       parameters:
 *         - in: query
 *           name: codice
 *           description: The code of the park or garden
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Point of Interest
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Park or garden not found
 */


/**
 * Handles GET requests to fetch parks and gardens data.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response containing the data or an error message.
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');

    try {
        return NextResponse.json(await fetchData(parchi_e_giardini_schema, 'codice', codice));
    } catch (error) {
        if (error instanceof ApiError)
            return NextResponse.json({error: error.message}, {status: error.statusCode});
    }
}