import {parchi_e_giardini} from "@/lib/definitions";

export async function getAllParchiEGiardini() {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/parchi_e_giardini');
        return await response.json() as parchi_e_giardini[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}