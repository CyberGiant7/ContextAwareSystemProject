import {eq} from "drizzle-orm";

export const dynamic = "force-dynamic"

import {NextRequest, NextResponse} from 'next/server'
import {db} from "@/../db";
import {user} from "@/../db/schema"

// GET /api/user
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')

    if (email) {
        const users = await db.select().from(user).where(eq(user.email, email));
        if (users.length === 0) {
            // error
            return NextResponse.json({error: 'User not found'}, {status: 404});
        }
        return NextResponse.json(users);
    }
    const users = await db.select().from(user)
    console.log(users)

    return NextResponse.json(users);
}


// export async function POST(request: NextRequest) {
//     const body = await request.json()
//     const res = await fetch(process.env.PATH_URL_BACKEND + '/api/posts', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//     })
//     const data = await res.json();
//     return NextResponse.json(data)
//
// }