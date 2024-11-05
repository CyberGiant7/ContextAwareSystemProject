"use client";

import React, {useEffect, useState} from "react";
import {user, zona_urbanistica} from "@/lib/definitions";
import {useSessionData} from "@/lib/useSessionData";
import dynamic from "next/dynamic";
import {getAllEquidistantPoints} from "@/queries/equidistant_points";

const LazyZoneSelectorMap = dynamic(() => import("@/components/mapComponents/simpleMap"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

export default function App() {
    const [user, setUser] = useState<user>();
    const [equidistantPoints, setEquidistantPoints] = useState<any[]>([]);
    const session = useSessionData();

    useEffect(() => {
        if (session.status === "authenticated") {
            setUser(session?.data?.user);
        }
    }, [session]);

    useEffect(() => {
        if (user) {
            getAllEquidistantPoints(user.email, "1500").then(setEquidistantPoints).catch(console.error);
        }
    }, [user]);

    return (
        <div className="App">
            <LazyZoneSelectorMap
                width="100%"
                height={"100%"}
                equidistantPoints={equidistantPoints}
            />
        </div>
    );
}