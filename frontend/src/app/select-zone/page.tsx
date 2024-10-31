// frontend/src/app/page.tsx
"use client";
import React, {Suspense, useEffect, useState} from 'react';

import {getAllZone} from "@/queries/zone";
import {zona_urbanistica} from "@/lib/definitions";
import ZoneSelectorView from '@/components/ZoneSelectorComponent';

export default function Page() {
    const [zone, setZone] = useState<zona_urbanistica[]>([]);

    useEffect(() => {
        getAllZone().then(setZone).catch(console.error);
    }, []);

    return (
        <div className="App">
            <Suspense fallback={<>loading</>}>
                <ZoneSelectorView zone={zone} setZone={setZone} />
            </Suspense>
        </div>
    );
}