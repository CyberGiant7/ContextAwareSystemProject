import {NextRequest, NextResponse} from 'next/server';
import {farmacie as farmacie_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {ApiError} from "next/dist/server/api-utils";

export const dynamic = "force-dynamic";

/**
 * @swagger
 *  /api/farmacie:
 *     get:
 *       description: Returns a list of pharmacies in the city of Bologna
 *       parameters:
 *         - in: query
 *           name: civ_key
 *           description: The civ_key of the pharmacy
 *           schema:
 *             type: string
 *           required: false
 *       tags:
 *         - Farmacie
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: Pharmacy not found
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const civ_key = searchParams.get('civ_key');

    try {
        return NextResponse.json(await fetchData(farmacie_schema, 'civ_key', civ_key));
    } catch (error) {
        if (error instanceof ApiError)
            return NextResponse.json({error: error.message}, {status: error.statusCode});
    }
}