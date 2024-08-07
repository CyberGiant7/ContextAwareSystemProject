import {NextRequest} from 'next/server';
import {parcheggi as parcheggi_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";

export const dynamic = "force-dynamic";


/**
 * @swagger
 *  /api/parcheggi:
 *     get:
 *       description: Returns a list of all the parking lots in the city of Bologna
 *       parameters:
 *         - in: query
 *           name: codice
 *           description: The code of the parking lot
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Parcheggi
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Parking lot not found
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');
    return fetchData(parcheggi_schema, 'codice', codice);
}