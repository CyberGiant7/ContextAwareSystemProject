"use client";
import React, {createContext, useContext, useEffect, useState} from "react";
import {immobile} from "@/lib/definitions";
import {SearchParamsContext} from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import {useSessionData} from "@/lib/useSessionData";
import {getAllImmobili, getAllImmobiliInZone} from "@/queries/immobili";


export const ImmobiliContext = createContext<immobile[]>([]);
export const SelectedZoneContext = createContext<string[]>([]);
export const VisibleImmobiliContext = createContext<[immobile[], React.Dispatch<React.SetStateAction<immobile[]>>]>([[], () => {
}]);
export const SelectedImmobileContext = createContext<[string | null, React.Dispatch<React.SetStateAction<string | null>>]>([null, () => {
}]);
export const SortedByContext = createContext<[string | null, React.Dispatch<React.SetStateAction<string | null>>]>([null, () => {
}]);

export default function DataWrapper({children}: Readonly<{ children: React.ReactNode; }>) {
    const [immobili, setImmobili] = useState<immobile[]>([]);
    const [visibleImmobili, setVisibleImmobili] = useState<immobile[]>([]);
    const [selectedImmobile, setSelectedImmobile] = useState<string | null>(null);
    const [sortedBy, setSortedBy] = useState<string | null>(null);

    const searchParams = useContext(SearchParamsContext);
    const selected_zone_param = searchParams?.getAll('zona') as string | string[];
    const radius_param = searchParams?.get('radius') as string;
    const [selectedZone, setSelectedZone] = useState<string[]>(Array.isArray(selected_zone_param) ? selected_zone_param : [selected_zone_param].filter(Boolean));

    const session = useSessionData()
    const user = session.data?.user;


    useEffect(() => {
        if (selectedZone.length === 0) {
            getAllImmobili(user !== undefined && sortedBy == "rank", user?.email, radius_param).then(setImmobili).catch(console.error);
        } else {
            getAllImmobiliInZone(selectedZone, user !== undefined && sortedBy == "rank", user?.email, radius_param).then(setImmobili).catch(console.error);
        }
    }, [selectedZone, user?.email, sortedBy]);


    return (
        <SelectedImmobileContext.Provider value={[selectedImmobile, setSelectedImmobile]}>
            <VisibleImmobiliContext.Provider value={[visibleImmobili, setVisibleImmobili]}>
                <ImmobiliContext.Provider value={immobili}>
                    <SelectedZoneContext.Provider value={selectedZone}>
                        <SortedByContext.Provider value={[sortedBy, setSortedBy]}>
                            {children}
                        </SortedByContext.Provider>
                    </SelectedZoneContext.Provider>
                </ImmobiliContext.Provider>
            </VisibleImmobiliContext.Provider>
        </SelectedImmobileContext.Provider>
    );
}
