import {NextRequest, NextResponse} from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    try {
        // Retrieve the API key from environment variables
        const apiKey = process.env.OPENROUTESERVICE_API_KEY;

        // Parse the JSON body of the request to extract vehicle, position, and travelTime
        const {vehicle, position, travelTime} = await request.json();

        // Check if vehicle, position, and travelTime are provided
        if (!vehicle || !position || !travelTime) {
            // Return a 400 response if any of the required parameters are missing
            return new Response('Vehicle, position and travelTime are required', {status: 400});
        }

        // Make a POST request to the OpenRouteService API to get isochrones
        const response = await fetch(
            `https://api.openrouteservice.org/v2/isochrones/${vehicle}`,  // Modify "foot-walking" depending on the vehicle
            {
                method: 'POST',
                headers: {
                    // Set the authorization header with the API key
                    'authorization': apiKey as string,
                    // Set the content type to JSON
                    'Content-Type': 'application/json; charset=utf-8'
                },
                // Add the URL parameters
                body: JSON.stringify({
                    // Set the location coordinates
                    locations: [[position.lng, position.lat]],
                    // Set the range in seconds (convert travelTime from minutes to seconds)
                    range: [travelTime * 60],
                    // Set the range type to time
                    range_type: 'time',
                    // Set the interval for the isochrone
                    interval: travelTime * 60
                })
            }
        );

        // Parse the JSON response from the API
        const data = await response.json();

        // Return the data as a JSON response with a 200 status
        return new NextResponse(JSON.stringify(data), {status: 200});
    } catch (error) {
        // Log any errors that occur during the process
        console.error('Errore nel calcolo dell\'isochrone:', error);
    }
}