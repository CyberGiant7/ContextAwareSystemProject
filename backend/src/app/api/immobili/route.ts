import {NextRequest} from 'next/server'
import {immobili as immobili_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";


export const dynamic = "force-dynamic"

/**
 * @swagger
 *  /api/immobili:
 *     get:
 *       description: Returns a list of real estate in the city of Bologna
 *       parameters:
 *         - in: query
 *           name: civ_key
 *           description: The code of the of real estate
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Immobili
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Real estate not found
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const civ_key = searchParams.get('civ_key')
    return fetchData(immobili_schema, 'civ_key', civ_key)
}