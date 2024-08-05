import {NextRequest, NextResponse} from 'next/server';
import {strutture_sanitarie as strutture_sanitarie_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const civ_key = searchParams.get('civ_key');
    return fetchData(strutture_sanitarie_schema, 'civ_key', civ_key);
}