import {NextRequest, NextResponse} from 'next/server';
import {supermercati as supermercati_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');
    return fetchData(supermercati_schema, 'codice', codice);
}