import {NextRequest, NextResponse} from 'next/server';
import {bar_ristoranti as bar_ristoranti_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');
    return fetchData(bar_ristoranti_schema, 'codice', codice);
}