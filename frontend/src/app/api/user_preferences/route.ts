import {NextRequest, NextResponse} from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const email = searchParams.get('email');
        if (!email) {
            return NextResponse.json({error: 'Email is required'}, {status: 400});
        }

        const urlParams = new URLSearchParams();
        urlParams.append('email', email);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/user_preferences?${urlParams.toString()}`;

        const response = await fetch(url, {
            cache: "default"
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        return NextResponse.json({error: 'Failed to fetch user preferences'}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user_preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        return NextResponse.json(await response.json());
    } catch (error) {
        console.error('Error creating user preferences:', error);
        return NextResponse.json({error: 'Failed to create user preferences'}, {status: 500});
    }
}