export const dynamic = "force-dynamic"
import {zona_urbanistica} from "@/lib/definitions";

export async function getRankedZone(user_email: string) {
    try {
        const response = await fetch('api/zone?order=rank&email=' + user_email,{
            cache: 'force-cache'
        });
        return await response.json() as zona_urbanistica[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

export async function getAllZone() {
    try {
        const response = await fetch( 'api/zone');
        return await response.json() as zona_urbanistica[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}