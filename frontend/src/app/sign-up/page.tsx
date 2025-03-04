"use client";
import {Container, Form} from "react-bootstrap";
import React, {useState} from "react";
import {useFormState} from "react-dom";
import {authenticate} from "@/lib/actions";
import {user} from "@/lib/definitions";
import bcrypt from "bcryptjs";
import {createUser} from "@/queries/user";

/**
 * Validates the password input based on specific criteria.
 *
 * @param {HTMLInputElement} passwordInput - The password input element to validate.
 */
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

export default function Page() {
    const [newUser, setNewUser] = useState({email: '', password: '', first_name: '', last_name: ''});

    // State to manage form state, including error messages and form submission status
    const [errorMessage, formAction, isPending] = useFormState(
        (prevState: string | undefined, formData: FormData) => {
            return authenticate(prevState, formData);
        },
        undefined
    );

    /**
     * Handles changes to the password input field.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The event triggered by the password input field.
     */
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Validate the password input
        checkPassword(e.target);

        // If the input is invalid or empty, do not update the state
        if (!e.target.value || !e.target.checkValidity()) {
            return;
        }

        // Update the newUser state with the new password value
        setNewUser({...newUser, password: e.target.value});
    };

    /**
     * Adds a new user by submitting the form data.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     * @returns {Promise<void>} - A promise that resolves when the user is created.
     */
    const addUser = async (e: React.FormEvent<HTMLFormElement>): Promise<string | undefined> => {
        e.preventDefault();

        // Get the password input element
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        if (!passwordInput.checkValidity()) {
            return;
        }

        // Create a new user object
        const new_user: user = {
            email: newUser.email,
            password: bcrypt.hashSync(newUser.password, 10),
            first_name: newUser.first_name,
            last_name: newUser.last_name,
        };

        try {
            // Send a request to create the new user
            const response = await createUser(new_user);
            if (response.status === 201) {
                // Authenticate immediately after registration
                const formData = new FormData();
                formData.append('email', newUser.email);
                formData.append('password', newUser.password as string);
                return authenticate(undefined, formData);
            }
            if (response.status === 409) {
                // Handle case where email already exists
                const email = document.getElementById('email') as HTMLInputElement;
                email.setCustomValidity('Email already exists');
                email.reportValidity();
            }
        } catch (error) {
            // Log any errors that occur during user creation
            console.error('Error creating user:', error);
        }
    };

    return (
        <Container style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
        }}>
            <Form onSubmit={addUser}>
                <h3>Sign Up</h3>
                <div className="mb-3">
                    <label>First name</label>
                    <Form.Control
                        type="text"
                        placeholder="First name"
                        onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Last name</label>
                    <Form.Control
                        type="text"
                        placeholder="Last name"
                        onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
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
                            setNewUser({...newUser, email: e.target.value});
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
        </Container>
    );
}