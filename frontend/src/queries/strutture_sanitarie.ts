import {strutture_sanitarie} from "@/lib/definitions";

export async function getAllStruttureSanitarie() {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/strutture_sanitarie');
        return await response.json() as strutture_sanitarie[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}