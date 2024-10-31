import {immobile} from "@/lib/definitions";

export async function getAllImmobili(orderByRank: boolean, email?: string, radius?: string, rankMode?: string) {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/immobili`;
        if (orderByRank) {
            url += `?order=rank&email=${email}${radius ? '&radius=' + radius : ''}`
            url += rankMode ? `&rank_mode=${rankMode}` : '';
        }
        const response = await fetch(url, {
            cache: 'force-cache'
        });
        return await response.json() as immobile[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

export async function getAllImmobiliInZone(zone: string[], orderByRank: boolean, email?: string, radius?: string, rankMode?: string) {
    try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/immobili?${zone.map(z => `zona=${z}`).join('&')}`
        if (orderByRank) {
            url += `&order=rank&email=${email}${radius ? '&radius=' + radius : ''}`
            url += rankMode ? `&rank_mode=${rankMode}` : '';
        }
        const response = await fetch(url);
        return await response.json() as immobile[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}