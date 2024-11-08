import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const email = searchParams.get('email');
        if (!email) {
            return NextResponse.json({error: 'Email is required'}, {status: 400});
        }
        const radius = searchParams.get('radius');
        let url = `${process.env.NEXT_PUBLIC_API_URL}/equidistant_points?email=${email}${radius ? '&radius=' + radius : ''}`
        console.log('url', url);
        return await fetch(url, {
            cache: 'force-cache'
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({error: 'Error fetching data'}, {status: 500});
    }
}