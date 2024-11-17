import {eq} from "drizzle-orm";
import {NextRequest, NextResponse} from 'next/server'
import {db} from "@/../db";
import {user} from "@/../db/schema"

export const dynamic = "force-dynamic"


/**
 * @swagger
 *  /api/user:
 *     get:
 *       summary: Returns a user by email
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
 *         400:
 *           description: Bad Request - email is required
 *         404:
 *           description: User not found
 */
export async function GET(request: NextRequest) {
    // Extract search parameters from the request URL
    const searchParams = request.nextUrl.searchParams
    // Get the 'email' parameter from the search parameters
    const email = searchParams.get('email')

    // If 'email' is not provided, return a 400 Bad Request response
    if (!email) {
        return NextResponse.json({error: 'Bad Request - email is required'}, {status: 400});
    }

    // Query the database for users with the provided email
    const users = await db.select().from(user).where(eq(user.email, email));
    // If no users are found, return a 404 Not Found response
    if (users.length === 0) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }
    // Return the found users in the response
    return NextResponse.json(users);
}


/**
 * @swagger
 *  /api/user:
 *     post:
 *       summary: Creates a new user
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
 *         201:
 *           description: User created successfully
 *         400:
 *           description: Bad Request - email, password, first_name, last_name are required
 *         409:
 *           description: Conflict - email already exists
 */
export async function POST(request: NextRequest) {
    // Parse the JSON body of the request
    const body = await request.json()

    // Validate the request body to ensure all required fields are present
    if (!body.email || !body.password || !body.first_name || !body.last_name) {
        // Return a 400 Bad Request response if any required field is missing
        return NextResponse.json({error: 'Bad Request - email, password, first_name, last_name are required'}, {status: 400});
    }
    try {
        // Insert the new user into the database
        await db.insert(user).values(body);
        // Return a 201 Created response if the user is created successfully
        return NextResponse.json({message: 'User created successfully'}, {status: 201});
    } catch (e: any) {
        // Log the error for debugging purposes
        console.log(e)

        // Check if the error code indicates a conflict (e.g., email already exists)
        if (e.code === '23505') {
            // Return a 409 Conflict response if the email already exists
            return NextResponse.json({error: 'Conflict - email already exists'}, {status: 409})
        }
    }
}