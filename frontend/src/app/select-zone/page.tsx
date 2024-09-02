// frontend/src/app/page.tsx
"use client";
import React, {useEffect, useState} from 'react';
import "@/app/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';


import {getAllZone} from "@/queries/zone";
import {zona_urbanistica} from "@/lib/definitions";
import ZoneSelectorView from '@/components/ZoneSelectorComponent';

export default function Page() {
    const [activeZoneSelector, setActiveZoneSelector] = useState(false);
    const [zone, setZone] = useState<zona_urbanistica[]>([]);

    useEffect(() => {
        getAllZone().then(setZone).catch(console.error);
    }, []);

    return (
        <div className="App">
            <ZoneSelectorView zone={zone} setActiveZoneSelector={setActiveZoneSelector}/>
        </div>
    );
}