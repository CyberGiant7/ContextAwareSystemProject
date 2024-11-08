"use client"
import React, { useState } from 'react'
import bcrypt from 'bcryptjs';
import { useFormState } from "react-dom";
import { user } from "@/lib/definitions";
import { createUser } from "@/queries/user";
import { useRouter } from "next/navigation";
import { Form } from "react-bootstrap";
import { authenticate } from "@/lib/actions";

export default function SignUp() {
    const router = useRouter();
    const [newUser, setNewUser] = useState({ email: '', password: '', first_name: '', last_name: '' });

    const [errorMessage, formAction, isPending] = useFormState(
        (prevState: string | undefined, formData: FormData) => {
            return authenticate(prevState, formData);
        },
        undefined
    );

    // Funzione per il controllo della password
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        checkPassword(e.target);
        if (!e.target.value || !e.target.checkValidity()) {
            return;
        }
        setNewUser({ ...newUser, password: e.target.value });
    };

    // Funzione per aggiungere l'utente
    const addUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const passwordInput = document.getElementById('password') as HTMLInputElement;
        if (!passwordInput.checkValidity()) {
            return;
        }

        const new_user: user = {
            email: newUser.email,
            password: bcrypt.hashSync(newUser.password, 10),
            first_name: newUser.first_name,
            last_name: newUser.last_name,
        };

        try {
            const response = await createUser(new_user);

            if (response.status === 201) {
                // Autenticazione immediata dopo la registrazione
                const formData = new FormData();
                formData.append('email', newUser.email);
                formData.append('password', newUser.password as string);
                // formAction(formData);  // Attiva l'autenticazione
                return authenticate(undefined, formData)
                // router.push('/survey'); // Redirect dopo l'autenticazione
            }

            if (response.status === 409) {
                const email = document.getElementById('email') as HTMLInputElement;
                email.setCustomValidity('Email already exists');
                email.reportValidity();
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <Form onSubmit={addUser}>
            <h3>Sign Up</h3>

            <div className="mb-3">
                <label>First name</label>
                <Form.Control
                    type="text"
                    placeholder="First name"
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    required
                />
            </div>

            <div className="mb-3">
                <label>Last name</label>
                <Form.Control
                    type="text"
                    placeholder="Last name"
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    required
                />
            </div>

            <div className="mb-3">
                <label>Email address</label>
                <Form.Control
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => {
                        setNewUser({ ...newUser, email: e.target.value });
                        e.target.setCustomValidity('');
                    }}
                    required
                />
            </div>

            <div className="mb-3">
                <label>Password</label>
                <Form.Control
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    onInput={handlePasswordChange}
                    required
                />
            </div>

            <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={isPending}>
                    Sign Up
                </button>
            </div>

            {errorMessage && (
                <div className="alert alert-danger mt-3">
                    {errorMessage}
                </div>
            )}
        </Form>
    );
}

const checkPassword = (passwordInput: HTMLInputElement) => {
    if (passwordInput) {
        if (passwordInput.value.length < 8) {
            passwordInput.setCustomValidity('Password must be at least 8 characters long');
        } else if (passwordInput.value.length > 50) {
            passwordInput.setCustomValidity('Password must be less than 50 characters long');
        } else if (!passwordInput.value.match(/[a-z]*/)) {
            passwordInput.setCustomValidity('Password must contain at least one lowercase letter');
        } else if (!passwordInput.value.match(/[A-Z]/)) {
            passwordInput.setCustomValidity('Password must contain at least one uppercase letter');
        } else if (!passwordInput.value.match(/[0-9]/)) {
            passwordInput.setCustomValidity('Password must contain at least one number');
        } else {
            passwordInput.setCustomValidity('');
        }
    }
};
