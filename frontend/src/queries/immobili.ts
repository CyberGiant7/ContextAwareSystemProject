import {immobile} from "@/lib/definitions";

export async function getAllImmobili(orderByRank: boolean, email?: string, radius?: string) {
    try {
        console.log(`${process.env.NEXT_PUBLIC_API_URL}/immobili?${orderByRank ? '&order=rank&email=' + email : ''}`)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/immobili?${orderByRank ? '&order=rank&email=' + email : ''}${radius ? '&radius=' + radius : ''}`);
        // const response = await fetch(process.env.NEXT_PUBLIC_API_URL +  '/immobili');
        return await response.json() as immobile[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

//TODO add order by rank
export async function getAllImmobiliInZone(zone: string[], orderByRank: boolean, email?: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/immobili?${zone.map(z => `zona=${z}`).join('&')}`);
        console.log(`${process.env.NEXT_PUBLIC_API_URL}/immobili?${zone.map(z => `zona=${z}`).join('&')}`)
        return await response.json() as immobile[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}