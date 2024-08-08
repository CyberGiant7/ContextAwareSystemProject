import {NextRequest, NextResponse} from 'next/server';
import {bar_ristoranti as bar_ristoranti_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";

export const dynamic = "force-dynamic";

/**
 * @swagger
 *  /api/bar_ristoranti:
 *     get:
 *       description: Returns a list of bar and restaurants in the city of Bologna
 *       parameters:
 *         - in: query
 *           name: codice
 *           description: The code of the bar or restaurant
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Bar Ristoranti
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Bar or restaurant not found
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');
    return NextResponse.json(await fetchData(bar_ristoranti_schema, 'codice', codice));
}