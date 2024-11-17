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
    // State to store the list of urban zones
    const [zone, setZone] = useState<zona_urbanistica[]>([]);

    // State to store the user information
    const [user, setUser] = useState<user>();

    // Hook to get session data
    const session = useSessionData();

    // Effect to set user data when session is authenticated
    useEffect(() => {
        if (session.status === "authenticated") {
            setUser(session?.data?.user);
        }
    }, [session]);

    // Effect to get user preferences and ranked zones when user data is available
    useEffect(() => {
        if (user) {
            getUserPreferences(user.email).then((userPreferences) => {
                if (userPreferences) {
                    getRankedZone(user.email).then(setZone).catch(console.error);
                }
            }).catch(console.error);
        }
    }, [user]);

    // Effect to get all zones on component mount
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