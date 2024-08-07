import {palestre} from "@/lib/definitions";

export async function getAllPalestre() {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/palestre');
        return await response.json() as palestre[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}