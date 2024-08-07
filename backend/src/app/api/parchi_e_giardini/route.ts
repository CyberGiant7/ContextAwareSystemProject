import {NextRequest} from 'next/server';
import {parchi_e_giardini as parchi_e_giardini_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";

export const dynamic = "force-dynamic";

/**
 * @swagger
 *  /api/parchi_e_giardini:
 *     get:
 *       description: Returns a list of all the parks and gardens in the city of Bologna
 *       parameters:
 *         - in: query
 *           name: codice
 *           description: The code of the park or garden
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Parchi e Giardini
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Park or garden not found
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');
    return fetchData(parchi_e_giardini_schema, 'codice', codice);
}