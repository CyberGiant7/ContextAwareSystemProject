import {immobile} from "@/lib/definitions";

export async function getAllImmobili(options: {
    orderByRank: boolean,
    zone?: string[],
    email?: string,
    radius?: string,
    rankMode?: string
}) {
    const { orderByRank, zone, email, radius, rankMode } = options;

    try {
        const urlParams = new URLSearchParams();

        // Aggiungi parametri di zona, se presenti
        if (zone && zone.length > 0) {
            zone.forEach(z => urlParams.append('zona', z));
        }

        // Aggiungi parametri per ordinamento e filtraggio
        if (orderByRank) {
            if (!email) {
                throw new Error('Email is required');
            }
            urlParams.append('order', 'rank');
            urlParams.append('email', email);
            if (radius) urlParams.append('radius', radius);
            if (rankMode) urlParams.append('rank_mode', rankMode);
        }

        // Costruzione dell'URL finale
        const url = `api/immobili?${urlParams.toString()}`;

        const response = await fetch(url, {
            cache: 'force-cache'
        });
        return await response.json() as immobile[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
