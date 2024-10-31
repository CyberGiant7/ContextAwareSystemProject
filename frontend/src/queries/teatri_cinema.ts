import {teatri_cinema} from "@/lib/definitions";

export async function getAllTeatriCinema() {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/teatri_cinema',{
            cache: 'force-cache'
        });
        return await response.json() as teatri_cinema[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}