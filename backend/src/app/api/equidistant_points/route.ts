import {NextRequest, NextResponse} from "next/server";
import {InferSelectModel} from "drizzle-orm";
import * as schema from "../../../../db/schema";
import {fetchData} from "@/lib/fetchData";
import {ApiError} from "next/dist/server/api-utils";
import {rankPoints} from "@/lib/rankPoint";
import {db} from "../../../../db";

export async function GET(request: NextRequest) {
    const {searchParams} = request.nextUrl;
    const email = searchParams.get('email');
    const radius = searchParams.get('radius') || 500;

    // let results: any[] = [];

    if (!email) {
        return NextResponse.json({error: 'email is required'}, {status: 400});
    }

    let preferences: InferSelectModel<typeof schema.user_preferences>[] = [];
    let points: InferSelectModel<typeof schema.equidistant_points>[] = [];
    try {
        preferences = await fetchData(schema.user_preferences, 'email', email) as InferSelectModel<typeof schema.user_preferences>[];
        points = await fetchData(schema.equidistant_points) as InferSelectModel<typeof schema.equidistant_points>[];
    } catch (error) {
        if (error instanceof ApiError) {
            return NextResponse.json({error: error.message}, {status: error.statusCode});
        }
    }

    const rankedResults = await rankPoints(db, points, preferences[0], radius ? Number(radius) : undefined);
    return NextResponse.json(rankedResults);
}