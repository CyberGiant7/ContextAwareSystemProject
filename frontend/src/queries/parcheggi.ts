import {parcheggi} from "@/lib/definitions";

export async function getAllParcheggi() {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/parcheggi');
        return await response.json() as parcheggi[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}