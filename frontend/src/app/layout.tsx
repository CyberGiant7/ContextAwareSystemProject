import {SessionDataProvider} from '@/components/wrapper/SessionDataWrapper'
import DataWrapper from "@/components/wrapper/DataWrapper";
import type {Metadata} from "next";
import '../scss/mdb.free.scss';
import "./globals.css";

import NavbarComponent from "@/components/NavbarComponent";
import React from "react";

export const metadata: Metadata = {
    title: "Home Zone Analyzer",
    description: "Home Zone Analyzer is a web application that allows you to find the best place to live in a Bologna",
    authors: {name: "Leonardo Dessì", url: "https://github.com/CyberGiant7"},
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {

    return (
        <html lang="en">
        <body>
        <SessionDataProvider>
            <DataWrapper>
                <NavbarComponent/>
                <main style={{width: "100%", height: "auto"}}>
                    {children}
                </main>
            </DataWrapper>
        </SessionDataProvider>
        </body>
        </html>
    );
}
