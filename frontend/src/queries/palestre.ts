import {palestre} from "@/lib/definitions";

export async function getAllPalestre() {
    try {
        const response = await fetch( 'api/palestre',{
            cache: 'force-cache'
        });
        return await response.json() as palestre[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}