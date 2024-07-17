import {auth, signOut} from '@/auth';

const handleSignOut = async () => {
    'use server';
    await signOut();
}

export default async function Home() {
    // get user data
    const session = await auth()

    if (!session) return null
    if (!session.user) return null
    console.log("secret session:", session);


    return (
        <div>
            <h1>segreto</h1>
            <p>Welcome, {session.user.email}</p>
            <p>name {session.user.first_name}</p>
            <p>last name {session.user.last_name}</p>
            <p>Here is your secret content.</p>
            <form action={handleSignOut}>
                <button
                    className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                    <div className="hidden md:block">Sign Out</div>
                </button>
            </form>
        </div>
    );
}