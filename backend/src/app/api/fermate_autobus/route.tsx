import {NextRequest, NextResponse} from 'next/server';
import {fermate_autobus as fermate_autobus_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const codice = searchParams.get('codice');
    return fetchData(fermate_autobus_schema, 'codice', codice);
}