import {NextRequest, NextResponse} from 'next/server';
import {fermate_autobus as fermate_autobus_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {ApiError} from "next/dist/server/api-utils";

export const dynamic = "force-dynamic";

/**
 * @swagger
 *  /api/fermate_autobus:
 *     get:
 *       description: Returns a list of bus stops in the city of Bologna
 *       parameters:
 *         - in: query
 *           name: codice
 *           description: The code of the bus stop
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Fermate Autobus
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Bus stop not found
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');

    try {
        return NextResponse.json(await fetchData(fermate_autobus_schema, 'codice', codice));
    } catch (error) {
        if (error instanceof ApiError)
            return NextResponse.json({error: error.message}, {status: error.statusCode});
    }
}