import {parchi_e_giardini} from "@/lib/definitions";

export async function getAllParchiEGiardini() {
    try {
        const response = await fetch( 'api/parchi_e_giardini',{
            cache: 'force-cache'
        });
        return await response.json() as parchi_e_giardini[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}