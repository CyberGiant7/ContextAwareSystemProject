import {strutture_sanitarie} from "@/lib/definitions";

export async function getAllStruttureSanitarie() {
    try {
        const response = await fetch('api/strutture_sanitarie',{
            cache: 'force-cache'
        });
        return await response.json() as strutture_sanitarie[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}