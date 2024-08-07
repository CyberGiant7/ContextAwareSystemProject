import {scuole} from "@/lib/definitions";

export async function getAllScuole() {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/scuole');
        return await response.json() as scuole[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}