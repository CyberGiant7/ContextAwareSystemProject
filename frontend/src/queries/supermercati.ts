import {supermercati} from "@/lib/definitions";

export async function getAllSupermercati() {
    try {
        const response = await fetch( 'api/supermercati',{
            cache: 'force-cache'
        });
        return await response.json() as supermercati[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}