"use client";
import Link from "next/link";
import React, {useState} from "react";
import {
    MDBCollapse,
    MDBContainer,
    MDBIcon,
    MDBNavbar,
    MDBNavbarItem,
    MDBNavbarNav,
    MDBNavbarToggler
} from "mdb-react-ui-kit";

/**
 * NavbarComponent is a functional React component that renders the navigation bar.
 * It includes links to various sections of the application such as Home, Sign In, Sign Up, Profile, Survey, and Moran Index.
 *
 * @returns {React.JSX.Element} The rendered navigation bar component.
 */
export default function NavbarComponent(): React.JSX.Element {
    const [openBasic, setOpenBasic] = useState(false);
    return (
        <MDBNavbar expand="lg" light bgColor="light" fixed="top">
            <MDBContainer fluid>
                <Link className="navbar-brand" href={'/'}>
                    Home Zone Analyzer
                </Link>

                <MDBNavbarToggler
                    aria-controls='navbarTogglerDemo02'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                    onClick={() => setOpenBasic(!openBasic)}
                >
                    <i className="fa-solid fa-bars"></i>
                </MDBNavbarToggler>

                <MDBCollapse navbar open={openBasic}>
                    <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
                        <MDBNavbarItem>
                            <Link className="nav-link" href={'/sign-in'}>
                                Accedi
                            </Link>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <Link className="nav-link" href={'/sign-up'}>
                                Registrati
                            </Link>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <Link href={'/profile'} className="nav-link">
                                Profilo
                            </Link>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <Link href={'/survey'} className="nav-link">
                                Questionario
                            </Link>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <Link href={'/moran-index'} className="nav-link">
                                Moran Index
                            </Link>
                        </MDBNavbarItem>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBContainer>
        </MDBNavbar>
    );
}