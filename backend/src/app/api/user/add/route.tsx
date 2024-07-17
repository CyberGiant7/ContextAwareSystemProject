import {NextRequest, NextResponse} from 'next/server'
import {db} from "@/../db";
import {user} from "@/../db/schema"

export const dynamic = "force-dynamic"

interface User {
    email: string
    password: string
    first_name: string
    last_name: string
}

//add user
export async function POST(request: NextRequest) {
    const body = await request.json()

    //validate the request body
    if (!body.email || !body.password || !body.first_name || !body.last_name) {
        return NextResponse.json({}, {
            status: 400,
            statusText: 'Bad Request - email, password, first_name, last_name are required'
        })
    }
    try {
        const res = await db.insert(user).values(body);
        return NextResponse.json({}, {
            status: 200,
            statusText: 'OK',
        });
    } catch (e: any) {
        // if email already exists
        console.log(e)

        if (e.code === '23505') {
            return NextResponse.json({}, {status: 409, statusText: 'Conflict - email already exists'})
        }

    }
}