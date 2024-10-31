import {fermate_autobus} from "@/lib/definitions";

export async function getAllFermateAutobus() {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/fermate_autobus',{
            cache: 'force-cache'
        });
        return await response.json() as fermate_autobus[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}