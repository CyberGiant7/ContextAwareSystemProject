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

export async function createUser(user: user) {
    try {
        return await fetch(process.env.NEXT_PUBLIC_API_URL + '/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
    } catch (error) {
        console.error('Failed to create user:', error);
        throw new Error('Failed to create user.');
    }
}