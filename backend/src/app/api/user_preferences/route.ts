import {NextRequest, NextResponse} from "next/server";
import {db} from "@/../db";
import {user_preferences} from "@/../db/schema";
import {InferSelectModel, sql} from "drizzle-orm";

/**
 * @swagger
 * /api/user_preferences:
 *   get:
 *     summary: Retrieve user preferences by email
 *     description: Fetches user preferences from the database using the provided email address.
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The email address of the user whose preferences are to be retrieved.
 *     tags:
 *     - User Preferences
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Email parameter is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: User preferences not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Failed to fetch user preferences
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
// Define an asynchronous GET function to handle incoming requests
export async function GET(request: NextRequest) {
    // Extract search parameters from the request URL
    const searchParams = request.nextUrl.searchParams;
    // Get the 'email' parameter from the search parameters
    const email = searchParams.get('email');

    // Check if the 'email' parameter is provided
    if (!email) {
        return NextResponse.json({error: 'Email parameter is required'}, {status: 400});
    }

    let userPreferences: InferSelectModel<typeof user_preferences>[];
    try {
        // Fetch user preferences by email
        userPreferences = await getUserPreferencesByEmail(email);
    } catch (error) {
        // Handle any errors that occur during the fetch
        return handleErrorResponse(error as Error, 'Failed to fetch user preferences');
    }

    // Check if user preferences were found
    if (userPreferences.length === 0) {
        // Return a 404 response if no user preferences are found
        return NextResponse.json({error: 'User preferences not found'}, {status: 404});
    }

    // Return the found user preferences in the response
    return NextResponse.json(userPreferences);

}

/**
 * @swagger
 * /api/user_preferences:
 *   post:
 *     summary: Create or update user preferences
 *     description: Creates new user preferences or updates existing ones based on the provided email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               preferences:
 *                 type: object
 *                 description: The user preferences data.
 *     tags:
 *     - User Preferences
 *     responses:
 *       200:
 *         description: User preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       201:
 *         description: User preferences created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Failed to create or update user preferences
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * Handles POST requests to create or update user preferences.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response indicating the result of the operation.
 */
export async function POST(request: NextRequest) {
    // Parse the JSON body of the request
    const body = await request.json();
    let userPreferences;

    try {
        // Fetch user preferences by email
        userPreferences = await getUserPreferencesByEmail(body.email);
    } catch (error) {
        // Handle any errors that occur during the fetch
        return handleErrorResponse(error as Error, 'Failed to fetch user preferences');
    }

    // Check if user preferences already exist
    if (userPreferences.length > 0) {
        // Update existing user preferences
        return updateUserPreferences(body);
    } else {
        // Create new user preferences
        return createUserPreferences(body);
    }
}

/**
 * Handles error responses by logging the error and returning a JSON response with the error message and status code.
 *
 * @param {Error} error - The error object.
 * @param {string} message - The error message to be returned in the response.
 * @param {number} [statusCode=500] - The HTTP status code to be returned in the response. Defaults to 500.
 * @returns {NextResponse} - The JSON response containing the error message and status code.
 */
function handleErrorResponse(error: Error, message: string, statusCode: number = 500) {
    console.error(message, error);
    return NextResponse.json({error: message}, {status: statusCode});
}

/**
 * Fetches user preferences from the database using the provided email address.
 *
 * @param {string} email - The email address of the user whose preferences are to be retrieved.
 * @returns {Promise<InferSelectModel<typeof user_preferences>[]>} - A promise that resolves to the user preferences.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
async function getUserPreferencesByEmail(email: string): Promise<InferSelectModel<typeof user_preferences>[]> {
    try {
        // Query the database for user preferences with the provided email
        return await db.select().from(user_preferences).where(sql`email = ${email}`);
    } catch (error) {
        // Throw an error if the fetch operation fails
        throw new Error('Failed to fetch user preferences');
    }
}


/**
 * Function to create user preferences.
 *
 * @param {any} body - The request body containing user preferences data.
 * @returns {Promise<NextResponse>} - The response indicating the result of the creation operation.
 */
async function createUserPreferences(body: any): Promise<NextResponse> {
    try {
        // Insert the new user preferences into the database
        await db.insert(user_preferences).values(body);
        // Return a success response if the preferences are created successfully
        return NextResponse.json({message: 'User preferences created'}, {status: 201});
    } catch (error) {
        // Handle any errors that occur during the creation
        return handleErrorResponse(error as Error, 'Failed to create user preferences');
    }
}

/**
 * Function to update user preferences.
 *
 * @param {any} body - The request body containing user preferences data.
 * @returns {Promise<NextResponse>} - The response indicating the result of the update operation.
 */
async function updateUserPreferences(body: any): Promise<NextResponse> {
    try {
        // Update user preferences in the database where the email matches
        await db.update(user_preferences).set(body).where(sql`email = ${body.email}`);
        // Return a success response if the update is successful
        return NextResponse.json({message: 'User preferences updated'}, {status: 200});
    } catch (error) {
        // Handle any errors that occur during the update
        return handleErrorResponse(error as Error, 'Failed to update user preferences');
    }
}
