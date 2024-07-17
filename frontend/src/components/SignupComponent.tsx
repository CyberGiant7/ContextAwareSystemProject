import React, {useState} from 'react'
import bcrypt from 'bcryptjs';
import {redirect} from "next/navigation";
import {authenticate} from "@/app/lib/actions";
import {useFormState} from "react-dom";


export default function SignUp() {

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        checkPassword(e.target);
        if (!e.target.value || !e.target.checkValidity()) {
            return;
        }

        setNewUser({...newUser, password: e.target.value});
        console.log(newUser);
    }

    const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        e.preventDefault();

        const passwordInput = document.getElementById('password') as HTMLInputElement;
        if (!passwordInput.checkValidity()) {
            return;
        }
        try {
            const response = await fetch(`${apiUrl}/user/add`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: newUser.email,
                    password: bcrypt.hashSync(newUser.password, 10),
                    first_name: newUser.first_name,
                    last_name: newUser.last_name,
                }),
            });

            if (response.status === 200) {
                let formdata = new FormData();
                formdata.append('email', newUser.email);
                formdata.append('password', newUser.password);

                formAction(formdata);


                // let sas = await authenticate(undefined, );
                // console.log(sas);
                // redirect('/secret');
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

    const [errorMessage, formAction, isPending] = useFormState(
        authenticate,
        undefined,
    );
    const [newUser, setNewUser] = useState({email: '', password: '', first_name: '', last_name: ''});
    return (
        <form id="signup-form" onSubmit={createUser}>
            <h3>Sign Up</h3>
            <div className="mb-3">
                <label>First name</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                    required
                />
            </div>
            <div className="mb-3">
                <label>Last name</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                    required/>
            </div>
            <div className="mb-3">
                <label>Email address</label>
                <input
                    id="email"
                    type="email"
                    className="form-control"
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
                <input
                    id={"password"}
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    // minLength={8}
                    onInput={handlePasswordChange}
                    required
                />
            </div>
            <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                    Sign Up
                </button>
            </div>
        </form>
    )
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