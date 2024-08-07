import {immobile} from "@/lib/definitions";

export async function getAllImmobili() {
    try {
        console.log('api_url', process.env.NEXT_PUBLIC_API_URL);
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL +  '/immobili');
        return await response.json() as immobile[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}