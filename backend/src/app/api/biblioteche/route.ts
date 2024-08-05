import {NextRequest, NextResponse} from 'next/server';
import {biblioteche as biblioteche_schema} from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const nome_biblioteca = searchParams.get('nome');
    return fetchData(biblioteche_schema, 'biblioteca', nome_biblioteca);
}