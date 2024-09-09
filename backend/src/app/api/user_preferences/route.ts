import {NextRequest, NextResponse} from "next/server";
import {db} from "@/../db";
import {user_preferences} from "@/../db/schema";
import {sql} from "drizzle-orm";

// Utility function to handle errors
function handleErrorResponse(error: Error, message: string, statusCode: number = 500) {
    console.error(message, error);
    return NextResponse.json({error: message}, {status: statusCode});
}

// Function to get user preferences by email
async function getUserPreferencesByEmail(email: string) {
    try {
        return await db.select().from(user_preferences).where(sql`email
        =
        ${email}`);
    } catch (error) {
        throw new Error('Failed to fetch user preferences');
    }
}

// Function to create user preferences
async function createUserPreferences(body: any) {
    try {
        await db.insert(user_preferences).values(body);
        return NextResponse.json({status: 200, message: 'User preferences created'});
    } catch (error) {
        return handleErrorResponse(error as Error, 'Failed to create user preferences');
    }
}

// Function to update user preferences
async function updateUserPreferences(body: any) {
    try {
        await db.update(user_preferences).set(body).where(sql`email
        =
        ${body.email}`);
        return NextResponse.json({status: 200, message: 'User preferences updated'});
    } catch (error) {
        return handleErrorResponse(error as Error, 'Failed to update user preferences');
    }
}

// GET handler to retrieve user preferences by email
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (email) {
        let userPreferences;

        try {
            userPreferences = await getUserPreferencesByEmail(email);
        } catch (error) {
            return handleErrorResponse(error as Error, 'Failed to fetch user preferences');
        }

        if (userPreferences.length === 0) {
            return NextResponse.json({error: 'User preferences not found'}, {status: 404});
        }

        return NextResponse.json(userPreferences);
    }

    return NextResponse.json({error: 'Email parameter is required'}, {status: 400});
}

// POST handler to create or update user preferences
export async function POST(request: NextRequest) {
    const body = await request.json();
    let userPreferences;

    try {
        userPreferences = await getUserPreferencesByEmail(body.email);
    } catch (error) {
        return handleErrorResponse(error as Error, 'Failed to fetch user preferences');
    }

    if (userPreferences.length > 0) {
        return updateUserPreferences(body);
    } else {
        return createUserPreferences(body);
    }
}
