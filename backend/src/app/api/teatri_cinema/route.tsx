import {NextRequest, NextResponse} from 'next/server';
import {teatri_cinema as teatri_cinema_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const civ_key = searchParams.get('civ_key');
    return fetchData(teatri_cinema_schema, 'civ_key', civ_key);
}