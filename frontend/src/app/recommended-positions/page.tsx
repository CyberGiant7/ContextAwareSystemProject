"use client";

import React, {Suspense, useEffect, useState} from "react";
import {user} from "@/lib/definitions";
import {useSessionData} from "@/lib/useSessionData";
import dynamic from "next/dynamic";
import {getAllEquidistantPoints} from "@/queries/equidistant_points";
import {useSearchParams} from "next/navigation";

const LazyZoneSelectorMap = dynamic(() => import("@/components/mapComponents/HeatMap"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

function RecommendedPositions() {
    // State to store user data
    const [user, setUser] = useState<user>();
    // State to store equidistant points
    const [equidistantPoints, setEquidistantPoints] = useState<any[]>([]);
    // Hook to get session data
    const session = useSessionData();
    // Hook to get search parameters
    const searchParams = useSearchParams();
    // Default radius value
    const radius = searchParams.get("radius") || "1500";

    // Effect to set user data when session is authenticated
    useEffect(() => {
        if (session.status === "authenticated") {
            setUser(session?.data?.user);
        }
    }, [session]);

    // Effect to fetch equidistant points when user data is available
    useEffect(() => {
        if (user) {
            getAllEquidistantPoints(user.email, radius).then(setEquidistantPoints).catch(console.error);
        }
    }, [user]);
    return (
        <LazyZoneSelectorMap
            width="100%"
            height={"100%"}
            equidistantPoints={equidistantPoints}
        />
    );
}


export default function App() {
    return (
        <div className="App">
            <Suspense fallback={
                <div>
                    <h1>Loading...</h1>
                </div>
            }>
                <RecommendedPositions/>
            </Suspense>
        </div>
    );
}