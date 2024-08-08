import {NextRequest, NextResponse} from 'next/server'
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
    const zone = searchParams.getAll('zona')

    if (zone.length > 0) {
        let results: any[] = []
        for (const z of zone) {
            results = results.concat(await fetchData(immobili_schema, 'zona_di_prossimita', z))
        }
        // console.log(results)
        return NextResponse.json(results)
    }
    return NextResponse.json(await fetchData(immobili_schema, 'civ_key', civ_key))
}