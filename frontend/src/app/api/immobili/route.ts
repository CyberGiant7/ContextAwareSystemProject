import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const ranked = searchParams.get('order') === 'rank';
        const zones = searchParams.getAll('zona');
        const user_email = searchParams.get('email');
        const radius = searchParams.get('radius');
        const rank_mode = searchParams.get('rank_mode');

        if (ranked && !user_email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Usa URLSearchParams per costruire i parametri dell'URL
        const urlParams = new URLSearchParams();

        // Aggiungi parametri di zona, se presenti
        zones.forEach(zone => urlParams.append('zona', zone));

        // Aggiungi parametri di ordinamento, se richiesto
        if (ranked) {
            urlParams.append('order', 'rank');
            urlParams.append('email', user_email as string);
            if (radius) urlParams.append('radius', radius);
            if (rank_mode) urlParams.append('rank_mode', rank_mode);
        }

        // Costruzione dell'URL finale
        const url = `${process.env.NEXT_PUBLIC_API_URL}/immobili?${urlParams.toString()}`;

        const response = await fetch(url, {
            cache: 'force-cache'
        });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
}
