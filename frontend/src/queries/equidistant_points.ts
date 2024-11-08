import {equidistant_points} from "@/lib/definitions";

export async function getAllEquidistantPoints(email: string, radius: string) {
    try {
        let url = `api/equidistant_points?email=${email}${radius ? '&radius=' + radius : ''}`
        const response = await fetch(url, {
            cache: 'force-cache'
        });
        return await response.json() as equidistant_points[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
