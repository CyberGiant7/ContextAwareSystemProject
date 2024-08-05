import {NextRequest, NextResponse} from 'next/server'
import {immobili as immobili_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";


export const dynamic = "force-dynamic"

// GET /api/zone
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const civ_key = searchParams.get('civ_key')
    return fetchData(immobili_schema, 'civ_key', civ_key)
}