import {NextRequest, NextResponse} from 'next/server';
import {parchi_e_giardini as parchi_e_giardini_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');
    return fetchData(parchi_e_giardini_schema, 'codice', codice);
}