import {auth, signOut} from '@/auth';
import {user} from '@/lib/definitions';
import {Button, Form} from "react-bootstrap";

const handleSignOut = async () => {
    'use server';
    await signOut();
}

export default async function Home() {
    // get user data
    const session = await auth()

    if (!session) return null
    if (!session.user) return null

    let user = session.user as user;


    return (
        <div>
            <h1>Profilo</h1>
            <p>Benvenuto, {user.email}</p>
            <p>name {user.first_name}</p>
            <p>last name {user.last_name}</p>
            <p>Here is your secret content.</p>
            <Form action={handleSignOut}>
                <Button type={"submit"}>
                    Sign Out
                </Button>
            </Form>
        </div>
    );
}