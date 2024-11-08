import {NextRequest, NextResponse} from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.OPENROUTESERVICE_API_KEY;
        const {vehicle, position, travelTime} = await request.json();
        if (!vehicle || !position || !travelTime) {
            return new Response('Vehicle, position and travelTime are required', {status: 400});
        }
        const response = await fetch(
            `https://api.openrouteservice.org/v2/isochrones/${vehicle}`,  // Modifica "foot-walking" a seconda del mezzo
            {
                method: 'POST',
                headers: {
                    'authorization': apiKey as string,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                // Aggiungi i parametri URL
                body: JSON.stringify({
                    locations: [[position.lng, position.lat]],
                    range: [travelTime * 60],  // Converti il limite di tempo in secondi
                    range_type: 'time',
                    interval: travelTime * 60  // Intervallo di tempo per l'isochrone
                })
            }
        );
        const data = await response.json();
        return new NextResponse(JSON.stringify(data), {status: 200});
    } catch (error) {
        console.error('Errore nel calcolo dell\'isochrone:', error);
    }
}