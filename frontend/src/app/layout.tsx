import type {Metadata} from "next";
// import 'bootstrap/dist/css/bootstrap.min.css';

import '../scss/mdb.free.scss';
import "./globals.css";



import NavbarComponent from "@/components/NavbarComponent";
import React from "react";
import {SessionProvider} from "next-auth/react";


export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html lang="en">
        <body>
        <SessionProvider>
            <NavbarComponent/>
            <main style={{width: "100%", height: "-webkit-fill-available"}}>
                {children}
            </main>
        </SessionProvider>
        </body>
        </html>
    );
}
