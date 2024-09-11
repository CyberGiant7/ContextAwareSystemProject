import {NextRequest, NextResponse} from 'next/server';
import {supermercati as supermercati_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {ApiError} from "next/dist/server/api-utils";

export const dynamic = "force-dynamic";

/**
 * @swagger
 *  /api/supermercati:
 *     get:
 *       description: Returns a list of supermarkets of the city of Bologna
 *       parameters:
 *         - in: query
 *           name: codice
 *           description: The code of the supermarket
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Supermercati
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Supermarket not found
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');

    try {
        return NextResponse.json(await fetchData(supermercati_schema, 'codice', codice));
    } catch (error) {
        if (error instanceof ApiError)
            return NextResponse.json({error: error.message}, {status: error.statusCode});
    }
}