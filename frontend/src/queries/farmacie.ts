import {farmacie} from "@/lib/definitions";

export async function getAllFarmacie() {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/farmacie',{
            cache: 'force-cache'
        });
        return await response.json() as farmacie[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}