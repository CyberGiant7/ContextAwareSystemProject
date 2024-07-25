"use client";
import React from 'react'
import '@/../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './page.module.css'

import dynamic from "next/dynamic";
import {Container} from "react-bootstrap";

const LazyMap = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

export default function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>App</h1>
            </header>
            <Container fluid style={{height:"-webkit-fill-available"}}>
            <LazyMap width="100%" height="100%"/>
            </Container>
        </div>
    )
}

