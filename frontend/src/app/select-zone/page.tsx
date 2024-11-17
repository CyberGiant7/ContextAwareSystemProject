// frontend/src/app/page.tsx
"use client";
import React, {Suspense, useEffect, useState} from 'react';

import {getAllZone} from "@/queries/zone";
import {zona_urbanistica} from "@/lib/definitions";
import ZoneSelectorView from '@/components/ZoneSelectorComponent';

export default function Page() {
    // State to store the list of urban zones
    const [zone, setZone] = useState<zona_urbanistica[]>([]);

    // Effect to get all zones on component mount
    useEffect(() => {
        getAllZone().then(setZone).catch(console.error);
    }, []);

    return (
        <div className="App">
            <Suspense fallback={<>loading</>}>
                <ZoneSelectorView zone={zone} setZone={setZone}/>
            </Suspense>
        </div>
    );
}