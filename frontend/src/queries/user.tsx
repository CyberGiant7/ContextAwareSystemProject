import {user} from "@/lib/definitions";



export async function getUser(email: string) {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/user?email=${email}`);
        if (response.ok) {
            let users: user[] = await response.json();
            return users[0];
        } else {
            return undefined;
        }
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}