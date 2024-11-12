import {NextRequest, NextResponse} from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const email = searchParams.get('email');
        if (!email) {
            return NextResponse.json({error: 'Missing email'}, {status: 400});
        }
        return await fetch(process.env.BACKEND_API_URL + '/user?email=' + email);
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body) {
            return NextResponse.json({error: 'Missing body'}, {status: 400});
        }

        return await fetch(process.env.BACKEND_API_URL + '/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
    } catch (error) {
        console.error('Failed to create user:', error);
        throw new Error('Failed to create user.');
    }

}