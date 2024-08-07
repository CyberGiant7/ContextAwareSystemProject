import {biblioteche} from "@/lib/definitions";

export async function getAllBiblioteche() {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/biblioteche');
        return await response.json() as biblioteche[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}