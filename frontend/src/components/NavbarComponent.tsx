"use client";
import Link from "next/link";
import React from "react";
import {useSession} from "next-auth/react";

export default function NavbarComponent() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
            <div className="container">
                <Link className="navbar-brand" href={'/'}>
                    Home Zone Analyzer
                </Link>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link" href={'/sign-in'}>
                                Accedi
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href={'/sign-up'}>
                                Registrati
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href={'/profile'}
                                  className="nav-link">Profilo</Link>
                        </li>
                        <li className="nav-item">
                            <Link href={'/survey'}
                                  className="nav-link">Questionario</Link>
                        </li>
                    </ul>
                </div>

            </div>
        </nav>
    );
}