import {NextRequest, NextResponse} from 'next/server';
import {strutture_sanitarie as strutture_sanitarie_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {ApiError} from "next/dist/server/api-utils";

export const dynamic = "force-dynamic";

/**
 * @swagger
 *  /api/strutture_sanitarie:
 *     get:
 *       description: Returns a list of health facilities in the city of Bologna
 *       parameters:
 *         - in: query
 *           name: civ_key
 *           description: The civ_key of the health facility
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Strutture Sanitarie
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Health facility not found
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const civ_key = searchParams.get('civ_key');

    try {
        return NextResponse.json(await fetchData(strutture_sanitarie_schema, 'civ_key', civ_key));
    } catch (error) {
        if (error instanceof ApiError)
            return NextResponse.json({error: error.message}, {status: error.statusCode});
    }
}