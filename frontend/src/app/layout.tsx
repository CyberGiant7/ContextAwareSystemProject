import {SessionDataProvider} from '@/components/wrapper/SessionDataWrapper'
import DataWrapper from "@/components/wrapper/DataWrapper";
import type {Metadata} from "next";

import '../scss/mystyle.scss';

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
        <head>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.6.0/css/fontawesome.min.css"/>
        </head>
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
