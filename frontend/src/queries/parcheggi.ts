import {parcheggi} from "@/lib/definitions";

export async function getAllParcheggi() {
    try {
        const response = await fetch( 'api/parcheggi',{
            cache: 'force-cache'
        });
        return await response.json() as parcheggi[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}