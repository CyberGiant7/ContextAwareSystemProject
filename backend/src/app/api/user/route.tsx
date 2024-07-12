export const dynamic = "force-dynamic"

import {NextResponse} from 'next/server'
import {db} from "@/../db";
import {user} from "@/../db/schema"

// GET /api/user
export async function GET() {
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