import {NextRequest, NextResponse} from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        // Extract search parameters from the request URL
        const searchParams = request.nextUrl.searchParams;
        // Check if the 'order' parameter is set to 'rank'
        const ranked = searchParams.get('order') === 'rank';
        // Get all 'zona' parameters from the URL
        const zones = searchParams.getAll('zona');
        // Get the 'email' parameter from the URL
        const user_email = searchParams.get('email');
        // Get the 'radius' parameter from the URL
        const radius = searchParams.get('radius');
        // Get the 'rank_mode' parameter from the URL
        const rank_mode = searchParams.get('rank_mode');

        // If 'ranked' is true and 'email' is not provided, return an error response
        if (ranked && !user_email) {
            return NextResponse.json({error: 'Email is required'}, {status: 400});
        }

        // Use URLSearchParams to build the URL parameters
        const urlParams = new URLSearchParams();

        // Add 'zona' parameters to the URL if present
        zones.forEach(zone => urlParams.append('zona', zone));

        // Add sorting parameters if 'ranked' is true
        if (ranked) {
            urlParams.append('order', 'rank');
            urlParams.append('email', user_email as string);
            if (radius) urlParams.append('radius', radius);
            if (rank_mode) urlParams.append('rank_mode', rank_mode);
        }

        // Construct the final URL with the parameters
        const url = `${process.env.BACKEND_API_URL}/immobili?${urlParams.toString()}`;

        // Fetch data from the constructed URL with forced cache
        const response = await fetch(url, {
            cache: 'force-cache'
        });
        // Parse the response data as JSON
        const data = await response.json();
        // Return the fetched data as a JSON response
        return NextResponse.json(data);
    } catch (error) {
        // Log any errors that occur during the fetch
        console.error('Error fetching data:', error);
        // Return an error response with status 500
        return NextResponse.json({error: `Error fetching data`}, {status: 500});
    }
}
