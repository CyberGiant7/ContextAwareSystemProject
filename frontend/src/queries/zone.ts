export const dynamic = "force-dynamic"
import {zona_urbanistica} from "@/lib/definitions";

export async function getRankedZone(user_email: string) {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL +  '/zone?order=rank&email=' + user_email);
        return await response.json() as zona_urbanistica[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

export async function getAllZone() {
    try {
        console.log('api_url', process.env.NEXT_PUBLIC_API_URL);
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL +  '/zone');
        return await response.json() as zona_urbanistica[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}