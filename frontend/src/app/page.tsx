"use client";
import React, {useEffect, useState} from 'react';

import CardComponent from '../components/CardComponent';
import {CardGroup, Row} from "react-bootstrap";

interface User {
    email: string;
    password: string;
}

export default function Home() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({email: '', password: ''});

    // Fetch users
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/user`);
                setUsers(await response.json());
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData().catch(console.error);
    }, []);

    // Create a user
    const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/user/add`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newUser),
            });
            setUsers([await response.json(), ...users]);
            setNewUser({email: '', password: ''});
        } catch
            (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="space-y-4 w-full max-w-2xl">
                <h1 className="text-2xl font-bold text-gray-800 text-center">User Management App</h1>

                {/* Form to add new user */}
                <form onSubmit={createUser} className="p-4 bg-blue-100 rounded shadow">
                    <input
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="mb-2 w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                        placeholder="Name"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="mb-2 w-full p-2 border border-gray-300 rounded"
                    />
                    <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                        Add User
                    </button>
                </form>

                {/* Display users */}
                <div className="space-y-2">
                    <Row xs={2} md={6}  className="g-4 py-5 px-4">
                        {users.map((user) => (
                            <CardComponent card={user} key={user.email} />
                        ))}
                    </Row>
                </div>
            </div>
        </main>
    );
}