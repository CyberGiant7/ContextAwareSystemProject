import {NextRequest, NextResponse} from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const ranked = searchParams.get('order') === 'rank';
        if (ranked) {
            const user_email = searchParams.get('email');
            if (!user_email) {
                return NextResponse.json({error: 'Email is required'}, {status: 400});
            }
            return await fetch(process.env.NEXT_PUBLIC_API_URL +  '/zone?order=rank&email=' + user_email,{
                cache: 'force-cache'
            });
        }
        return await fetch(process.env.NEXT_PUBLIC_API_URL + '/zone', {
            cache: 'force-cache'
        })
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({error: 'Error fetching data'}, {status: 500});
    }
}