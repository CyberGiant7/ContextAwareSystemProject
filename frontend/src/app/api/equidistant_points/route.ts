import {NextRequest, NextResponse} from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const email = searchParams.get('email');
        if (!email) {
            return NextResponse.json({error: 'Email is required'}, {status: 400});
        }
        const radius = searchParams.get('radius');
        let url = `${process.env.BACKEND_API_URL}/equidistant_points?email=${email}${radius ? '&radius=' + radius : ''}`
        return await fetch(url);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({error: 'Error fetching data'}, {status: 500});
    }
}