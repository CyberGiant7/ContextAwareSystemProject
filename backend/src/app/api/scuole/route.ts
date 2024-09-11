import {NextRequest, NextResponse} from 'next/server';
import {scuole as scuole_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {ApiError} from "next/dist/server/api-utils";

export const dynamic = "force-dynamic";

/**
 * @swagger
 *  /api/scuole:
 *     get:
 *       description: Returns a list of schools in the city of Bologna
 *       parameters:
 *         - in: query
 *           name: civ_key
 *           description: The civ_key of the school
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Scuole
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: School not found
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const civ_key = searchParams.get('civ_key');

    try {
        return NextResponse.json(await fetchData(scuole_schema, 'civ_key', civ_key));
    } catch (error) {
        if (error instanceof ApiError)
            return NextResponse.json({error: error.message}, {status: error.statusCode});
    }

}