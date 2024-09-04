"use client";
import Link from "next/link";
import React from "react";
import {useSession} from "next-auth/react";

export default function NavbarComponent() {
    let session = useSession();
    console.log("session: ", session);

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
                                Login
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href={'/sign-up'}>
                                Sign up
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href={'/secret'}>
                                Secret
                            </Link>
                        </li>
                    </ul>
                </div>
                    <a className="nav-link">{session.data?.user.first_name} {session.data?.user.last_name}</a>
            </div>
        </nav>
    );
}