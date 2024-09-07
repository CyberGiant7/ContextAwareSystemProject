import {immobile} from "@/lib/definitions";

export async function getAllImmobili() {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL +  '/immobili');
        return await response.json() as immobile[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

export async function getAllImmobiliInZone(zone: string[]) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/immobili?${zone.map(z => `zona=${z}`).join('&')}`);
        console.log(`${process.env.NEXT_PUBLIC_API_URL}/immobili?${zone.map(z => `zona=${z}`).join('&')}`)
        return await response.json() as immobile[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}