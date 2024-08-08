import {NextRequest, NextResponse} from 'next/server';
import {teatri_cinema as teatri_cinema_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";

export const dynamic = "force-dynamic";

/**
 * @swagger
 *  /api/teatri_cinema:
 *     get:
 *       description: Returns a list of theaters and cinemas of the city of Bologna
 *       parameters:
 *         - in: query
 *           name: civ_key
 *           description: The code of the theater or cinema
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Teatri e Cinema
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Theater or cinema not found
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const civ_key = searchParams.get('civ_key');
    return NextResponse.json(await fetchData(teatri_cinema_schema, 'civ_key', civ_key));
}