"use client";
import React from 'react'
import {useFormState} from "react-dom";
import {authenticate} from "@/lib/actions";
import {Form} from "react-bootstrap";

export default function Login() {
    const [errorMessage, formAction, isPending] = useFormState(
        (prevState: string | undefined, formData:FormData)=> {
            return authenticate(prevState, formData)
        },
        undefined,
    );
    return (
        <Form action={formAction}>
            <h3>Accedi</h3>
            <div className="mb-3">
                <label>Indirizzo email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Inserisci il tuo indirizzo email"
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <label>Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    required
                    className="form-control"
                    minLength={6}
                    placeholder="Inserisci la password"
                />
            </div>
            <div className="d-grid">
                <button type="submit" className="btn btn-primary" aria-disabled={isPending}>
                    Submit
                </button>
            </div>
            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <>
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    </>
                )}
            </div>
        </Form>
    )
}
