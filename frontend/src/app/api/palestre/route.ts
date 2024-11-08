import {NextResponse} from "next/server";

export async function GET(request: Request) {
    try {
        return await fetch(process.env.NEXT_PUBLIC_API_URL + '/palestre', {
            cache: 'force-cache'
        })
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({error: 'Error fetching data'}, {status: 500});
    }
}