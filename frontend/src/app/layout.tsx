import { SessionDataProvider } from '@/components/wrapper/SessionDataWrapper'
import type {Metadata} from "next";
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
        <SessionDataProvider>
            <NavbarComponent/>
            <main style={{width: "100%", height: "auto"}}>
                {children}
            </main>
        </SessionDataProvider>
        </body>
        </html>
    );
}
