import {NextRequest, NextResponse} from 'next/server';
import {palestre as palestre_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";

export const dynamic = "force-dynamic";

/**
 * @swagger
 *  /api/palestre:
 *     get:
 *       description: Returns a list of gyms in the city of Bologna
 *       parameters:
 *         - in: query
 *           name: codice
 *           description: The code of the gym
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Palestre
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Gym not found
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');
    return fetchData(palestre_schema, 'codice', codice);
}