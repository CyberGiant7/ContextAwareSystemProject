import {scuole} from "@/lib/definitions";

export async function getAllScuole() {
    try {
        const response = await fetch('api/scuole',{
            cache: 'force-cache'
        });
        return await response.json() as scuole[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}