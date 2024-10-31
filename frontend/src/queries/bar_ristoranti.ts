import {bar_ristoranti} from "@/lib/definitions";

export async function getAllBarRistoranti() {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/bar_ristoranti',{
            cache: 'force-cache'
        });
        return await response.json() as bar_ristoranti[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}