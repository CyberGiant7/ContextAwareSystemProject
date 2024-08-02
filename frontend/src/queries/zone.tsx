export const dynamic = "force-dynamic"
import {zone_urbanistiche} from "@/app/lib/definitions";


export async function getAllZone() {
    try {
        console.log('api_url', process.env.NEXT_PUBLIC_API_URL);
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL +  '/zone');
        return await response.json() as zone_urbanistiche[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}