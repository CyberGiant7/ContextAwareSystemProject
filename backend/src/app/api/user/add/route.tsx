export const dynamic = "force-dynamic"
import {NextRequest, NextResponse} from 'next/server'
import {db} from "@/../db";
import {user} from "@/../db/schema"

//add user
export async function POST(request: NextRequest) {
    const body = await request.json()
    const res = await db.insert(user).values(body)
    return NextResponse.json(body)
}