import {NextRequest, NextResponse} from 'next/server';
import {biblioteche as biblioteche_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";

export const dynamic = "force-dynamic";


/**
 * @swagger
 *  /api/biblioteche:
 *     get:
 *       description: Returns a list of library in the city of Bologna
 *       parameters:
 *         - in: query
 *           name: codice
 *           description: The code of the library
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Biblioteche
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Library not found
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');
    return NextResponse.json(await fetchData(biblioteche_schema, 'codice', codice));
}