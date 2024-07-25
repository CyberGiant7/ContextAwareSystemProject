import {zone_urbanistiche} from "@/app/lib/definitions";

export const dynamic = "force-dynamic"

export async function getAllZone() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/zone`);
        return await response.json() as zone_urbanistiche[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}