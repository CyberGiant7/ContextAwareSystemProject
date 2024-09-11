import {eq} from "drizzle-orm";

export const dynamic = "force-dynamic"

import {NextRequest, NextResponse} from 'next/server'
import {db} from "@/../db";
import {user} from "@/../db/schema"


/**
 * @swagger
 *  /api/user:
 *     get:
 *       description: Returns a user
 *       parameters:
 *         - in: query
 *           name: email
 *           description: The email of the user
 *           schema:
 *             type: string
 *           required: true
 *       tags:
 *         - User
 *       responses:
 *         200:
 *           description: OK
 *         404:
 *           description: User not found
 */
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


/**
 * @swagger
 *  /api/user:
 *     post:
 *       description: Create a new user
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *       tags:
 *         - User
 *       responses:
 *         200:
 *           description: OK
 *         400:
 *           description: Bad Request - email, password, first_name, last_name are required
 *         409:
 *           description: Conflict - email already exists
 */
export async function POST(request: NextRequest) {
    const body = await request.json()

    //validate the request body
    if (!body.email || !body.password || !body.first_name || !body.last_name) {
        return NextResponse.json({error: 'Bad Request - email, password, first_name, last_name are required'}, {status: 400});
    }
    try {
        const res = await db.insert(user).values(body);
        return NextResponse.json({message: 'User created successfully'}, {status: 201});
    } catch (e: any) {
        // if email already exists
        console.log(e)

        if (e.code === '23505') {
            return NextResponse.json({error: 'Conflict - email already exists'}, {status: 409})
        }

    }
}