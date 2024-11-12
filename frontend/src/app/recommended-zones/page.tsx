"use client";

import React, {useEffect, useState} from "react";
import {user, zona_urbanistica} from "@/lib/definitions";
import {getAllZone, getRankedZone} from "@/queries/zone";
import {useSessionData} from "@/lib/useSessionData";
import {getUserPreferences} from "@/queries/user_preferences";
import dynamic from "next/dynamic";

const LazyZoneSelectorMap = dynamic(() => import("@/components/mapComponents/RecommendedZoneMap"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

export default function App() {
    const [zone, setZone] = useState<zona_urbanistica[]>([]);
    const [user, setUser] = useState<user>();
    const session = useSessionData();

    useEffect(() => {
        if (session.status === "authenticated") {
            setUser(session?.data?.user);
        }
    }, [session]);

    useEffect(() => {
        if (user) {
            getUserPreferences(user.email).then((userPreferences) => {
                if (userPreferences) {
                    getRankedZone(user.email).then(setZone).catch(console.error);
                }
            }).catch(console.error);
        }
    }, [user]);


    useEffect(() => {
        getAllZone().then(setZone).catch(console.error);
    }, []);


    return (
        <div className="App">
            <LazyZoneSelectorMap
                width="100%"
                zone={zone}
                setZone={setZone}
            />
        </div>
    );
}