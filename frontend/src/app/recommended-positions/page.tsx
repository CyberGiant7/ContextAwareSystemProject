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
    const [user, setUser] = useState<user>();
    const [equidistantPoints, setEquidistantPoints] = useState<any[]>([]);
    const session = useSessionData();
    const searchParams = useSearchParams();
    const radius = searchParams.get("radius") || "1500";

    useEffect(() => {
        if (session.status === "authenticated") {
            setUser(session?.data?.user);
        }
    }, [session]);

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